module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: ['eslint:recommended', 'google'],
  plugins: ['prettier'],
  rules: {
    'no-restricted-globals': ['error', 'name', 'length'],
    'prefer-arrow-callback': 'error',
    'linebreak-style': ['error', 'windows'], // Allow CRLF line endings
    quotes: ['error', 'double', { allowTemplateLiterals: true }],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto', // Adjust to match your project's line endings
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.spec.*'],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
