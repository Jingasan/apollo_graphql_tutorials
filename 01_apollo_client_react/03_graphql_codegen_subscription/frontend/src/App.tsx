import { ApolloProvider, useMutation, useSubscription } from "@apollo/client";
import {
  IncrementNumberMutation,
  IncrementNumberDocument,
  NumberIncrementedSubscription,
  NumberIncrementedDocument,
} from "./generated/graphql";
import { client } from "./client";

// サブスクリプションのPublish用コンポーネント
const IncrementNumber = () => {
  const [incrementNumber] = useMutation<IncrementNumberMutation>(
    IncrementNumberDocument
  );
  const handleClick = () => {
    incrementNumber();
  };
  return (
    <div>
      <button onClick={handleClick}>Increment Number</button>
    </div>
  );
};

// サブスクリプション受信コンポーネント
const NumberIncrementer = () => {
  // サーバーからサブスクリプションデータを受け取る。
  // サブスクリプションが実行される度に
  // コンポーネントが再レンダリングされ、最新のデータが表示される。
  const { data, loading, error } =
    useSubscription<NumberIncrementedSubscription>(NumberIncrementedDocument);

  if (loading) return <h1>Current Number: 0</h1>;
  if (error) return <h1>Error: {error.message}</h1>;
  return <h1>Current Number: {data?.numberIncremented}</h1>;
};

// ApolloProviderでアプリ全体をラップし、Apollo Clientを利用可能にする。
const App = () => (
  <ApolloProvider client={client}>
    <IncrementNumber />
    <NumberIncrementer />
  </ApolloProvider>
);

export default App;
