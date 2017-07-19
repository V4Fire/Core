'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

module.exports = {
	snakeskin: {
		base: {
			pack: false,
			filters: {global: ['undef']},
			adapterOptions: {transpiler: true}
		}
	},

	babel: {
		base: {
			plugins: [
				'syntax-flow',
				'transform-flow-strip-types',
				'transform-decorators-legacy',
				'transform-class-properties',
				'transform-es2015-object-super',
				'transform-function-bind',
				['transform-object-rest-spread', {useBuiltIns: true}],
				['transform-runtime', {
					helpers: true,
					polyfill: false,
					regenerator: false
				}]
			],

			compact: false
		}
	}
};
