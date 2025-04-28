module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    transform: {
      '^.+\\.(ts|js|mjs|html)$': 'jest-preset-angular',
    },
    transformIgnorePatterns: [
      'node_modules/(?!@ngrx|@angular|rxjs)',
    ],
    moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
    testEnvironment: 'jest-environment-jsdom',
  };
  