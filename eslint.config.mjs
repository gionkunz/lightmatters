import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'scope:app',
              onlyDependOnLibsWithTags: ['*'],
            },
            {
              sourceTag: 'scope:chapter',
              onlyDependOnLibsWithTags: [
                'scope:engine',
                'scope:primitive',
                'scope:physics',
                'scope:design',
              ],
            },
            {
              sourceTag: 'scope:primitive',
              onlyDependOnLibsWithTags: [
                'scope:engine',
                'scope:physics',
                'scope:design',
              ],
            },
            {
              sourceTag: 'scope:engine',
              onlyDependOnLibsWithTags: ['scope:design'],
            },
            {
              sourceTag: 'scope:design',
              onlyDependOnLibsWithTags: [],
            },
            {
              sourceTag: 'scope:physics',
              onlyDependOnLibsWithTags: [],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
