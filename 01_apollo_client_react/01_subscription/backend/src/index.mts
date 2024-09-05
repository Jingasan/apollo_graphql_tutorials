import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import { createServer } from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";
import bodyParser from "body-parser";
import cors from "cors";

// Pubsubクラス（開発環境用）：イベントの発行(publish)と購読(subscribe)を処理するクラス
// https://www.apollographql.com/docs/apollo-server/data/subscriptions/#production-pubsub-libraries
// 以下のPubSubクラスはインメモリ型のPubSubであるため、
// 本番環境ではRedisなどの外部DBを用いるPubsubクラスパッケージを使用するべきである。
const pubsub = new PubSub();

// 数値インクリメント用のグローバル変数
let currentNumber = 0;

// スキーマの定義
const typeDefs = `#graphql
  # Queryのスキーマ（ApolloServerの仕様上、最低１つのQuery型が必須）
  type Query {
    currentNumber: Int
  }
  # Subscriptionのスキーマ
  type Subscription {
    numberIncremented: Int
  }
`;

// リゾルバーマップの定義
const resolvers = {
  Query: {
    currentNumber() {
      return currentNumber;
    },
  },
  Subscription: {
    numberIncremented: {
      // サブスクリプションの指定のイベント(NUMBER_INCREMENTED)を監視し、
      // それらのイベントが発生したときにリアルタイムでデータを処理して返す。
      subscribe: () => pubsub.asyncIterator(["NUMBER_INCREMENTED"]),
    },
  },
};

// リゾルバー付きのスキーマを作成
const schemaWithResolvers = makeExecutableSchema({ typeDefs, resolvers });

// HTTPサーバーを作成（後ほどWebSocketサーバーとApolloServerを割り当てる）
const app = express();
const httpServer = createServer(app);

// WebSocketサーバーのセットアップ
const wsServer = new WebSocketServer({
  server: httpServer, // HTTPサーバーと同じネットワークポートでWebSocketサーバーを起動
  path: "/graphql", // HTTPサーバーと同じエンドポイントとするためにpathに/graphqlを設定する。
});
// useServerでWebSocketを介したGraphQLのSubscriptionを扱うことができるようになる。
const serverCleanup = useServer(
  {
    schema: schemaWithResolvers, // リゾルバー付きのGraphQLスキーマを渡す
  },
  wsServer
);

// ApolloServerのセットアップ
const server = new ApolloServer({
  schema: schemaWithResolvers, // リゾルバー付きのGraphQLスキーマを渡す
  // Apollo Serverの動作をカスタマイズ
  plugins: [
    // Apollo Serverを立ち上げるためにHTTPサーバーをシャットダウン
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Apollo Serverを立ち上げるためにWebSocketサーバーをシャットダウン
    {
      // サーバー起動直前に実行されるロジックの定義
      async serverWillStart() {
        return {
          // サーバー終了時に実行されるロジックの定義
          async drainServer() {
            // クリーンアップ処理を行う。
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

// HTTPサーバー起動
await server.start();
app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server)
);
// HTTPサーバーを指定したポート番号でリッスンさせる。
const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Query endpoint ready at http://localhost:${PORT}/graphql`);
  console.log(`Subscription endpoint ready at ws://localhost:${PORT}/graphql`);
});

// 動作確認の為のタイマーによる実行処理：1秒おきにPublishする。
function incrementNumber() {
  currentNumber++;
  pubsub.publish("NUMBER_INCREMENTED", { numberIncremented: currentNumber });
  setTimeout(incrementNumber, 1000);
}
// 自動インクリメント開始
incrementNumber();
