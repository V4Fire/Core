const
	path = require('path');

/**
 * Factory for creating require wrappers:
 *
 * 1) If the string has substring ${root}:
 *    substring will be replace to cwd directory, or if the module isn't exists, the substring will be replaced to base directory
 *
 * 2) Or, cwd / base directory will be add to the beginning of the source string
 *
 * @param {string} cwd - working directory
 * @param {string=} [base]
 * @returns {function (string): ?}
 */
module.exports = function (cwd, base = path.dirname(module.parent.filename)) {
	return function (src) {
		function resolve(root) {
			const
				r = /\${root}/g;

			if (r.test(src)) {
				return src.replace(r, root);
			}

			return path.join(root, src);
		}

		try {
			return require(resolve(cwd));

		} catch (_) {
			return require(resolve(base));
		}
	};
};
