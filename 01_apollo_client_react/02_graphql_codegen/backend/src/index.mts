import { ApolloServer } from "@apollo/server";
import { loadFiles } from "@graphql-tools/load-files";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers.mjs";

// Apollo Serverのセットアップ
const server = new ApolloServer({
  // スキーマ定義の指定
  typeDefs: await loadFiles("src/**/*.gql"),
  // リゾルバーの指定
  resolvers,
});

// サーバー起動処理
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});
console.log(`Server ready at ${url}`);
