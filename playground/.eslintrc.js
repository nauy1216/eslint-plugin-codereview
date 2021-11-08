module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: false,
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    'codereview',
  ],
  rules: {
    'codereview/no-unused-vars': 2,
    'codereview/no-unused-tsvars': 2,
    // indent: 'off'
  },
};