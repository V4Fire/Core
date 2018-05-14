/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

const
	{config: {superRgxp}} = require('@pzlr/build-core'),
	path = require('path');

/**
 * Factory for creating require wrappers:
 *
 * 1) If the string has substring ${root}:
 *    substring will be replace to one of roots values (from the end) until the will be find
 *
 * 2) Or, one of roots values will be add to the beginning of the source string
 *
 * @param {Array<string>} roots - list of root directories
 * @returns {function (string): ?}
 */
module.exports = function (roots) {
	return function (src) {
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
			src = src.replace(superRgxp, '');
			r = r.slice(0, -1);
		}

		for (let i = r.length; i--;) {
			const
				url = resolve(r[i]);

			try {
				return require(resolve(r[i]));

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
