import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import { createServer } from "http";
import { loadFiles } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import cors from "cors";
import { pubsub, resolvers } from "./resolvers.mjs";

// スキーマの作成
const schema = makeExecutableSchema({
  typeDefs: await loadFiles("src/**/*.gql"),
  resolvers,
});

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
    schema: schema, // リゾルバー付きのGraphQLスキーマを渡す
  },
  wsServer
);

// ApolloServerのセットアップ
const server = new ApolloServer({
  schema: schema, // リゾルバー付きのGraphQLスキーマを渡す
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
  express.json(),
  expressMiddleware(server)
);
// HTTPサーバーを指定したポート番号でリッスンさせる。
const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Query endpoint ready at http://localhost:${PORT}/graphql`);
  console.log(`Subscription endpoint ready at ws://localhost:${PORT}/graphql`);
});
