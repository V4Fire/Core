'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

const
	{config: {projectName, dependencies}} = require('@pzlr/build-core');

/**
 * String with project dependencies to use with regular expressions
 */
exports.depsRgxpStr = [projectName]
	.concat(dependencies)

	.map((el) => {
		const src = Object.isString(el) ? el : el.src;
		return src.split(/[\\/]/).map(RegExp.escape).join('[\\\\/]');
	})

	.join('|');

/**
 * RegExp to detect file paths that are registered as dependencies within ".pzlrrc"
 * @type {RegExp}
 *
 * @example
 * **.pzlrrc**
 * ```json
 * {
 *   dependencies: ['@v4fire/client', '@v4fire/core']
 * }
 * ```
 *
 * ```js
 * isLayerDep.test('./node_modules/@v4fire/client/bla')              // true
 * isLayerDep.test('./node_modules/@v4fire/client/node_modules/bla') // false
 * isLayerDep.test('./node_modules/bla')                             // false
 * ```
 */
exports.isLayerDep = new RegExp(
	'' +

	// Layer imports
	`(?:^|[\\\\/])node_modules[\\\\/](?:${exports.depsRgxpStr})(?:[\\\\/]|$)` +

	'|' +

	// Simple imports
	'^(?:(?!(?:^|[\\\\/])node_modules[\\\\/]).)*$'
);

/**
 * RegExp to detect file paths that aren't registered as dependencies within ".pzlrrc"
 * @type {RegExp}
 *
 * @example
 * **.pzlrrc**
 * ```json
 * {
 *   dependencies: ['@v4fire/client', '@v4fire/core']
 * }
 * ```
 *
 * ```js
 * isExternalDep.test('./node_modules/@v4fire/client/bla')              // false
 * isExternalDep.test('./node_modules/@v4fire/client/node_modules/bla') // true
 * isExternalDep.test('./node_modules/bla')                             // true
 * ```
 */
exports.isExternalDep = new RegExp(
	'' +

	'^(?:(?!(?:^|[\\\\/])node_modules[\\\\/]).)*' +

	`[\\\\/]?node_modules[\\\\/](?:(?!${exports.depsRgxpStr}).)*$`
);
