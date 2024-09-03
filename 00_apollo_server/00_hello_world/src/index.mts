import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { randomUUID } from "crypto";

// GraphQLスキーマの定義
const typeDefs = `#graphql
  type Query {
    hello: String
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
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
  Mutation: {
    createUser: (_parent: any, args: any, _context: any) => {
      const newUser = {
        id: randomUUID(),
        name: args.name,
        email: args.email,
      };
      users.push(newUser);
      return newUser;
    },
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
