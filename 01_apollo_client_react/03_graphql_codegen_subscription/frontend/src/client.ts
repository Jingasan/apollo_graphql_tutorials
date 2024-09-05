import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
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
export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
