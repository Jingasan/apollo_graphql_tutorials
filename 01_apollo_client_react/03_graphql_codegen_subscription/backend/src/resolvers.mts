import { PubSub } from "graphql-subscriptions";

// Pubsubクラス（開発環境用）：イベントの発行(publish)と購読(subscribe)を処理するクラス
// https://www.apollographql.com/docs/apollo-server/data/subscriptions/#production-pubsub-libraries
// 以下のPubSubクラスはインメモリ型のPubSubであるため、
// 本番環境ではRedisなどの外部DBを用いるPubsubクラスパッケージを使用するべきである。
export const pubsub = new PubSub();

// リゾルバーマップの定義
export const resolvers = {
  Query: {},
  Subscription: {
    numberIncremented: {
      // サブスクリプションの指定のイベント(NUMBER_INCREMENTED)を監視し、
      // それらのイベントが発生したときにリアルタイムでデータを処理して返す。
      subscribe: () => pubsub.asyncIterator(["NUMBER_INCREMENTED"]),
    },
  },
};
