import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// スキーマの定義
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
  typeDefs,
  resolvers,
});

// サーバーを起動
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server ready at ${url}`);
