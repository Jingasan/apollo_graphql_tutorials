import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
} from "@apollo/client";
// 生成された型とクエリ
import { GetHelloQuery, GetHelloDocument } from "./generated/graphql";

// Apollo Clientの設定
const client = new ApolloClient({
  uri: "http://localhost:4000", // Apollo Serverのエンドポイント
  cache: new InMemoryCache(), // クエリ結果をメモリにキャッシュする設定
});

// データを取得するコンポーネント
const Hello = () => {
  // useQueryフックでGraphQLクエリを発行する。
  const { loading, error, data } = useQuery<GetHelloQuery>(GetHelloDocument);
  // loading, error, dataの状態に応じて異なるコンテンツを表示する。
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <h1>{data?.hello}</h1>;
};

// ApolloProviderでアプリ全体をラップし、Apollo Clientを利用可能にする。
const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h2>My Apollo app with TypeScript</h2>
      <Hello />
    </div>
  </ApolloProvider>
);

export default App;
