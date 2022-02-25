module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "next/core-web-vitals",
    "plugin:react/recommended",
    "google",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/errors",
    "plugin:tailwindcss/recommended",
    "prettier",
  ],
  overrides: [
    {
      files: ["*.ts", "*.tsx"], // Your TypeScript files extension
      parserOptions: { project: ["./tsconfig.json"] }, // Specify it only for TypeScript files
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 12,
    sourceType: "module",
  },
  settings: {
    react: { version: "detect" },
    "import/resolver": {
      typescript: {},
      node: { extensions: [".ts"] },
    },
  },
  plugins: [
    "react",
    "@typescript-eslint",
    "tailwindcss",
    "import",
    "unused-imports",
  ],
  rules: {
    "require-jsdoc": "off",
    "sort-imports": 0,
    "import/order": [2, { alphabetize: { order: "asc" } }],
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/naming-convention": [
      "error",
      { selector: "typeAlias", format: ["PascalCase"] },
      {
        selector: "variable",
        types: ["boolean"],
        format: ["PascalCase"],
        prefix: ["is", "should", "has"],
      },
    ],
    "unused-imports/no-unused-imports": "warn",
    "func-style": ["error", "declaration", { allowArrowFunctions: true }],
    // "no-console": ["error", { allow: ["warn", "info", "error"] }],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "import/named": "off",
    "react/jsx-handler-names": [
      "error",
      {
        eventHandlerPrefix: "handle",
        eventHandlerPropPrefix: "on",
        checkLocalVariables: true,
        // checkInlineFunction: true,
      },
    ],
  },
};
