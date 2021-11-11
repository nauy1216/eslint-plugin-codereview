module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    jest: false,
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "codereview"
  ],
  rules: {
    'codereview/no-unused-code': 2,
    indent: 'off'
  },
};
