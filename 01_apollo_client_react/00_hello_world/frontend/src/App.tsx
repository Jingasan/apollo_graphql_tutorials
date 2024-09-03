import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
} from "@apollo/client";

// Apollo Clientの設定
const client = new ApolloClient({
  uri: "http://localhost:4000", // Apollo Serverのエンドポイント
  cache: new InMemoryCache(), // クエリ結果をメモリにキャッシュする設定
});

// クエリの定義
const GET_HELLO = gql`
  query GetHello {
    hello
  }
`;

// データを取得するコンポーネント
const Hello = () => {
  // useQueryフックでGraphQLクエリを発行する。
  const { loading, error, data } = useQuery(GET_HELLO);
  // loading, error, dataの状態に応じて異なるコンテンツを表示する。
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <h1>{data.hello}</h1>;
};

// ApolloProviderでアプリ全体をラップし、Apollo Clientを利用可能にする。
const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h2>My first Apollo app</h2>
      <Hello />
    </div>
  </ApolloProvider>
);

export default App;
