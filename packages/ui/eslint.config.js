import baseConfig from "@applier/eslint-config/base";
import reactConfig from "@applier/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];
