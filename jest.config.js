/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  moduleFileExtensions: ['js', 'json', 'node', 'ts'],
  watchPlugins: ['jest-runner-eslint/watch-fix'],
  projects: [
    {
      runner: 'jest-runner-eslint',
      displayName: 'Lint',
      testMatch: [
        '<rootDir>/src/**/*.ts',
        '<rootDir>/apps/**/*.ts',
        '<rootDir>/libs/**/*.ts',
        '<rootDir>/test/**/*.ts',
      ],
    },
    {
      displayName: 'Unit',
      rootDir: 'src',
      testEnvironment: 'node',
      preset: 'ts-jest',
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/../',
      }),
    },
    {
      displayName: 'E2E',
      rootDir: 'test',
      testEnvironment: 'node',
      setupFiles: ['dotenv/config'],
      preset: 'ts-jest',
      testRegex: '.e2e-spec.ts$',
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/../',
      }),
    },
  ],
};
