const
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

		for (let i = roots.length; i--;) {
			const
				url = resolve(roots[i]);

			try {
				return require(resolve(roots[i]));

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
