/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/** @type {import('ts-jest').InitialOptionsTsJest} */
export default {
	projects: ['<rootDir>'],
	testMatch: ['<rootDir>/dist/server/**/*[sS]pec.js', '<rootDir>/src/**/*[sS]pec.ts'],
	rootDir: './',
	testTimeout: 20000,
	testEnvironment: 'node',
	bail: 2,
	reporters: ['default'],

	silent: true,
	clearMocks: true,

	collectCoverage: true,
	coverageReporters: ['lcov'],
	coverageDirectory: '<rootDir>/coverage',
	coverageProvider: 'v8',

	preset: 'ts-jest',
	modulePaths: ['<rootDir>/src/'],
	setupFilesAfterEnv: ['<rootDir>/src/test.ts']
};
