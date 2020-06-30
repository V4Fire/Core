'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

const
	{config: {dependencies}} = require('@pzlr/build-core');

/**
 * String with project dependencies to use with regular expressions
 */
exports.depsRgxpStr = dependencies.length > 1 ?
	dependencies.map((el) => {
		const src = Object.isString(el) ? el : el.src;
		return src.split(/[\\/]/).map(RegExp.escape).join('[\\\\/]');
	}).join('|') :

	Math.random().toString(16);
