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
	testMatch: ['<rootDir>/src/**/*[sS]pec.ts', '<rootDir>/src/**/?(*.)+(spec).ts'],
	rootDir: './',
	testTimeout: 20000,
	testEnvironment: 'node',
	reporters: ['default'],

	clearMocks: true,
	silent: true,

	collectCoverage: true,
	coverageReporters: ['lcov'],
	coverageDirectory: '<rootDir>/coverage',
	coverageProvider: 'v8',

	preset: 'ts-jest',
	modulePaths: ['<rootDir>/src/'],
	setupFilesAfterEnv: ['<rootDir>/src/test.ts']
};
