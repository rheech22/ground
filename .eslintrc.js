module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-unused-expressions': 'off',
    'import/no-unresolved': 'off',
    'no-console': 'off',
    'no-alert': 'off',
    'no-new': 0,
    'no-param-reassign': 0,
    'new-cap': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
