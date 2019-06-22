module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true,
    'jest/globals': true,
  },
  extends: ['eslint:recommended'],
  plugins: ['jest'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    logger: true,
    fixtures: true,
    client: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-var': 'error',
  },
};
