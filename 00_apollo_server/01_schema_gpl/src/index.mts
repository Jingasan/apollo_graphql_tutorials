import { ApolloServer } from "@apollo/server";
import { loadFiles } from "@graphql-tools/load-files";
import { startStandaloneServer } from "@apollo/server/standalone";
import { randomUUID } from "crypto";

// ダミーデータ
const users = [
  { id: "1", name: "user", email: "user@email.com" },
  { id: "2", name: "guest", email: "guest@email.com" },
];

// リゾルバーマップの定義
const resolvers = {
  Query: {
    users: () => users,
  },
  Mutation: {
    createUser: (_parent: any, args: any, _context: any, _info: any) => {
      const newUser = {
        id: randomUUID(),
        name: args.input.name,
        email: args.input.email,
      };
      users.push(newUser);
      return newUser;
    },
  },
};

// Apollo Serverのセットアップ
const server = new ApolloServer({
  // 型定義の指定
  typeDefs: await loadFiles("src/**/*.gql"),
  // リゾルバーマップの指定
  resolvers,
});

// サーバー起動処理
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});
console.log(`Server ready at ${url}`);
