import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
// 生成された型とクエリ
import {
  GetUsersQuery,
  GetUsersDocument,
  CreateUserMutation,
  CreateUserDocument,
  CreateUserMutationVariables,
} from "./generated/graphql";

// Apollo Clientの設定
const client = new ApolloClient({
  uri: "http://localhost:4000", // Apollo Serverのエンドポイント
  cache: new InMemoryCache(), // クエリ結果をメモリにキャッシュする設定
});

/**
 * useQueryでデータを取得するコンポーネント
 * useQuery: コンポーネントがRenderされたらクエリを実行
 * @returns
 */
const UseQuery = () => {
  // useQueryフックでGraphQLクエリを発行する。
  const { loading, error, data } = useQuery<GetUsersQuery>(GetUsersDocument);
  // loading, error, dataの状態に応じて異なるコンテンツを表示する。
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <p>{JSON.stringify(data?.users)}</p>;
};

/**
 * useLazyQueryでデータを取得するコンポーネント
 * useLazyQuery: 任意のイベントをトリガーにクエリを実行する
 * @returns
 */
const UseLazyQuery = () => {
  const [getUsers, { loading, data, error }] = useLazyQuery<GetUsersQuery>(
    GetUsersDocument,
    {
      // データフェッチのポリシーの設定
      fetchPolicy: "cache-and-network",
    }
  );
  return (
    <div>
      <button onClick={() => getUsers()}>Load Users</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <ul>
          {data.users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/**
 * useMutationでデータを追加するコンポーネント
 * useMutation: 任意のイベントをトリガーにミューテーションを実行する
 * @returns
 */
const UseMutation = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  // useMutation を使用して、型安全なミューテーションを呼び出す
  const [createUser, { data, loading, error }] = useMutation<
    CreateUserMutation,
    CreateUserMutationVariables
  >(CreateUserDocument, {
    // ミューテーション実行後に指定したクエリを再取得してキャッシュを更新
    refetchQueries: ["GetUsers"],
  });

  const handleUpdate = () => {
    createUser({ variables: { input: { name, email } } });
  };

  if (loading) return <p>Updating user...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <input
        type="text"
        placeholder="New Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="New Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleUpdate}>CreateUser</button>
      {data && <p>{JSON.stringify(data.createUser)}</p>}
    </div>
  );
};

// ApolloProviderでアプリ全体をラップし、Apollo Clientを利用可能にする。
const App = () => (
  <ApolloProvider client={client}>
    <h1>UseQuery</h1>
    <UseQuery />
    <h1>UseLazyQuery</h1>
    <UseLazyQuery />
    <h1>UseMutation</h1>
    <UseMutation />
  </ApolloProvider>
);

export default App;
