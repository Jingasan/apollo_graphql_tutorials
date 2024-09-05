import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  gql,
  split,
  HttpLink,
  useSubscription,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// HTTP接続の確立（クエリとミューテーション用）
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

// WebSocket接続の確立（サブスクリプション用）
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
  })
);

// split関数を使い、操作の種類に応じて上記接続先を切り替える。
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink, // WebSocket接続
  httpLink // HTTP接続
);

// Apollo Clientの作成
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

// サブスクリプションクエリ：リアルタイムでデータを受信する。
const NUMBER_INCREMENTED_SUBSCRIPTION = gql`
  subscription OnNumberIncremented {
    numberIncremented
  }
`;

// サブスクリプション受信コンポーネント
function NumberIncrementer() {
  // サーバーからサブスクリプションデータを受け取る。
  // サブスクリプションが実行される度に
  // コンポーネントが再レンダリングされ、最新のデータが表示される。
  const { data, loading, error } = useSubscription(
    NUMBER_INCREMENTED_SUBSCRIPTION
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <h1>Current Number: {data.numberIncremented}</h1>;
}

// ApolloProviderでアプリ全体をラップし、Apollo Clientを利用可能にする。
const App = () => (
  <ApolloProvider client={client}>
    <NumberIncrementer />
  </ApolloProvider>
);

export default App;
