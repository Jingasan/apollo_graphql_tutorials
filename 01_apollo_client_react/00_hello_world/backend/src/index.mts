import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// 型定義
const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
  }

  # Queryの型定義
  type Query {
    hello: String
    users: [User]
  }
`;

// ダミーデータ
const users = [
  { id: "1", name: "user", email: "user@email.com" },
  { id: "2", name: "guest", email: "guest@email.com" },
];

// リゾルバーマップの定義
const resolvers = {
  Query: {
    hello: () => "Hello, world!",
    users: () => users,
  },
};

// Apollo Serverのセットアップ
const server = new ApolloServer({
  typeDefs, // 型定義の指定
  resolvers, // リゾルバーマップの指定
});

// サーバー起動処理
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});
console.log(`Server ready at ${url}`);
