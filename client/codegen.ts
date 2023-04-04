
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/graphql",
  documents: "src/graphql/**/*.graphql",
  generates: {
    "src/gql/": {
      preset: "client-preset",
      plugins: ['typescript-urql']
    }
  }
};

export default config;
