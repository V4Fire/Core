/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
	projects: ['<rootDir>'],
	testMatch: ['<rootDir>/dist/server/**/*[sS]pec.js', '<rootDir>/src/**/*[sS]pec.ts'],
	rootDir: './',
	testTimeout: 15000,
	testEnvironment: 'node',
	preset: 'ts-jest',
	bail: 2,
	reporters: ['default', 'github-actions', 'summary'],

	silent: true,
  clearMocks: true,

  collectCoverage: true,
	coverageReporters: ['lcov'],
	coverageDirectory: '<rootDir>/coverage',
  coverageProvider: 'v8'
};
