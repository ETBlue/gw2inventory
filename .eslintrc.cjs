module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended", // Must be last
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
  plugins: ["react-refresh"],
  rules: {
    // React specific
    "react/prop-types": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],

    // TypeScript specific
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-explicit-any": "warn",

    // General rules
    "no-console": ["warn", { allow: ["warn", "error"] }],

    // Prettier integration
    "prettier/prettier": ["warn", {}, { usePrettierrc: true }],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: [
    "dist",
    "build",
    "node_modules",
    "coverage",
    "*.config.js",
    "*.config.ts",
    ".eslintrc.cjs",
  ],
}
