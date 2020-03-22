module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
  ],
  plugins: ["@typescript-eslint", "react"],
  env: { node: true, es6: true },
  parser: "@typescript-eslint/parser",
  rules: {
    "react/prop-types": "off",
  },
};
