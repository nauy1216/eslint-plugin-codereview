module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    jest: false,
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    // require('../lib/index.js')
    // path.resolve(__dirname, '../lib/index.js')
    "prettier"
  ],
  rules: {
    // 'codereview/no-unused-vars': 2,
    // 'codereview/no-unused-tsvars': 2,
    'codereview/no-unused-code': 2,
    // indent: 'off'
  },
};
