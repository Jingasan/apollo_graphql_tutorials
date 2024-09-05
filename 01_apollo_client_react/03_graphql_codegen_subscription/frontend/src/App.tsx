import { ApolloProvider, useSubscription } from "@apollo/client";
import {
  NumberIncrementedSubscription,
  NumberIncrementedDocument,
} from "./generated/graphql";
import { client } from "./client";

// サブスクリプション受信コンポーネント
const NumberIncrementer = () => {
  // サーバーからサブスクリプションデータを受け取る。
  // サブスクリプションが実行される度に
  // コンポーネントが再レンダリングされ、最新のデータが表示される。
  const { data, loading, error } =
    useSubscription<NumberIncrementedSubscription>(NumberIncrementedDocument);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <h1>Current Number: {data?.numberIncremented}</h1>;
};

// ApolloProviderでアプリ全体をラップし、Apollo Clientを利用可能にする。
const App = () => (
  <ApolloProvider client={client}>
    <NumberIncrementer />
  </ApolloProvider>
);

export default App;
