"use client";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useQuery,
} from "@apollo/client";
import { GetHelloQuery, GetHelloDocument } from "@/generated/graphql";

// Apollo Clientの設定
const client = new ApolloClient({
  uri: "http://localhost:3000/api/graphql", // Apollo Serverのエンドポイント
  cache: new InMemoryCache(), // クエリ結果をメモリにキャッシュする設定
});

// Queryを実行するコンポーネント
export function UseQuery() {
  // useQueryフックでGraphQLクエリを発行する。
  const { loading, error, data } = useQuery<GetHelloQuery>(GetHelloDocument);
  // loading, error, dataの状態に応じて異なるコンテンツを表示する。
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <p>{data?.hello}</p>;
}

// メインコンポーネント
export default function Home() {
  return (
    <ApolloProvider client={client}>
      <h1>UseQuery</h1>
      <UseQuery />
    </ApolloProvider>
  );
}
