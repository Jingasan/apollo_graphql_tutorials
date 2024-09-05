import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  // 上書きするかどうか
  overwrite: true,
  // GraphQLのスキーマファイル(URL指定でも良い)
  schema: "http://localhost:3000/api/graphql",
  // schema: "./src/graphql/schema.gql",
  // クライアントから発行するクエリファイル
  documents: "src/graphql/**/*.gql",
  // 型定義ファイルの出力先
  generates: {
    "src/graphql/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
    },
  },
};

export default config;
