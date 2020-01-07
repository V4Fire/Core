'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

const
	{config: {superRgxp}} = require('@pzlr/build-core');

const
	path = require('upath'),
	findUp = require('find-up'),
	{pathEqual} = require('path-equal');

/**
 * Factory for creating require wrappers:
 *
 * 1) If the string has a substring ${root}:
 *    the substring will be replaced by one of root directories (from the end) until the file is found
 *
 * 2) Or, one of root directories will be added to the beginning of the source string
 *
 * @param {Array<string>} roots - list of root directories
 * @returns {function (string, string?): ?}
 */
module.exports = function (roots) {
	return function (src, ctx) {
		function resolve(root) {
			const
				r = /\${root}/g;

			if (r.test(src)) {
				return src.replace(r, root);
			}

			return path.join(root, src);
		}

		let
			r = roots;

		if (superRgxp.test(src)) {
			if (!ctx) {
				throw new ReferenceError('The context for @super is not defined');
			}

			ctx = path.dirname(findUp.sync('.pzlrrc', {
				cwd: ctx
			}));

			r = r.slice(0, -1);

			for (let i = r.length; i--;) {
				if (pathEqual(ctx, r[i])) {
					r = r.slice(0, i);
					break;
				}
			}

			src = src.replace(superRgxp, '');
		}

		for (let i = r.length; i--;) {
			const
				url = resolve(r[i]);

			try {
				return require(url);

			} catch (err) {
				if (err.code !== 'MODULE_NOT_FOUND') {
					console.error(`Failed to load ${url}`);
					throw err;
				}
			}
		}

		require(src);
	};
};
