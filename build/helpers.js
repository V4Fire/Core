'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Returns the project version
 */
exports.getVersion = function () {
	return include('package.json').version;
};

/**
 * Returns the project disclaimer
 * @param {boolean=} [withVersion]
 */
exports.getHead = function (withVersion) {
	const
		fs = require('fs'),
		path = require('path');

	return fs
		.readFileSync(path.join(process.cwd(), 'disclaimer.txt'), 'utf-8')
		.replace(/\* (\w.*?)(?=\n)/, (str) => str + (withVersion ? ` v${exports.getVersion()}` : ''));
};
