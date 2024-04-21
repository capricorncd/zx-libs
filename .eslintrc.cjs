/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 09:54:35 (GMT+0900)
 */
module.exports = {
  root: true,
  env: { browser: true, node: true },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
      },
    ],
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'object',
          'type',
          'index',
        ],
        'newlines-between': 'never',
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: { order: 'asc', caseInsensitive: true },
        pathGroups: [
          // { "pattern": "assets/**", "group": "internal", "position": "before" },
        ],
      },
    ],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    // node.js require('some-lib')
    '@typescript-eslint/no-var-requires': 'off',
    // 可以使用@ts-ignore
    '@typescript-eslint/ban-ts-comment': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: { project: './tsconfig.json' },
    },
  },
}
