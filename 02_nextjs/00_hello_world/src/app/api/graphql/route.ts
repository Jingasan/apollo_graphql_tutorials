import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";

// 型定義
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

// リゾルバーマップの定義
const resolvers = {
  Query: {
    hello: () => "Hello, world!",
  },
};

// Apollo Serverのセットアップ
const server = new ApolloServer({
  typeDefs, // 型定義の指定
  resolvers, // リゾルバーマップの指定
});

// APIハンドラにApollo Serverを統合
const handler = startServerAndCreateNextHandler(server);
export { handler as GET, handler as POST };
