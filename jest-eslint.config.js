'use strict';

const base = require('@v4fire/linters/jest-eslint.config');

module.exports = {
	...base,
	testMatch: [
		'<rootDir>/src/**/*.ts',
		'<rootDir>/src/**/*.js',
		'<rootDir>/config/**/*.js',
		'<rootDir>/build/**/*.js',
		'<rootDir>/tests/**/*.ts',
		'<rootDir>/tests/**/*.js'
	]
};
