import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// GraphQLスキーマの定義
const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
  }

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

// リゾルバーの定義
const resolvers = {
  Query: {
    hello: () => "Hello, world!",
    users: () => users,
  },
};

// Apollo Serverのセットアップ
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// サーバー起動処理
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});
console.log(`Server ready at ${url}`);
