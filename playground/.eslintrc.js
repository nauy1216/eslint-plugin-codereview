const path = require('path')
module.exports = {
  root: true,
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
    // 'codereview/no-unused-vars': 2,
    // 'codereview/no-unused-tsvars': 2,
    'codereview/no-unused-code': 2,
    // indent: 'off'
  },
};
