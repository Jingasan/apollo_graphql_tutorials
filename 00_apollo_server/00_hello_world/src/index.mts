import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

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

// サーバーを起動
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server ready at ${url}`);
