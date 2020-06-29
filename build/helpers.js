'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

const
	fs = require('fs'),
	path = require('upath');

/**
 * Returns the project meta information
 * @returns {{name: string, version: string}}
 */
exports.getProjectInfo = function getProjectInfo() {
	const info = include('package.json');
	return Object.select(info, ['name', 'version']);
};

/**
 * Returns the project disclaimer
 * @param {boolean=} [withVersion]
 */
exports.getHead = function getHead(withVersion) {
	return fs
		.readFileSync(path.join(process.cwd(), 'disclaimer.txt'), 'utf-8')
		.replace(/\* (\w.*?)(?=\n)/, (str) => str + (withVersion ? ` v${exports.getProjectInfo().version}` : ''));
};
