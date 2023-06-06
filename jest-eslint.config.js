/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

'use strict';

const base = require('@v4fire/linters/jest-eslint.config');

module.exports = {
	...base,
	testMatch: [
		'<rootDir>/src/**/*.ts',
		'<rootDir>/src/**/*.js',
		'<rootDir>/config/**/*.js',
		'<rootDir>/build/**/*.js',
		'<rootDir>/ts-definitions/**/*.ts',
		'<rootDir>/index.d.ts',
		'<rootDir>/gulpfile.js',
		'<rootDir>/.eslintrc.js',
		'<rootDir>/jest-eslint.config.js',
		'<rootDir>/jest-runner-eslint.config.js',
		'<rootDir>/jest.config.ts'
	]
};
