/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

'use strict';

const
	{config: {superRgxp}} = require('@pzlr/build-core');

const
	fs = require('fs'),
	path = require('upath'),
	findUp = require('find-up'),
	{pathEqual} = require('path-equal');

/**
 * @typedef {{
 *   ctx?: string,
 *   return?: ('path'|'source'|'module'),
 *   source?: boolean
 * }}
 */

const IncludeOptions = {};

/**
 * Returns a function, which can import modules within node.js process from the specified directories.
 * The returned function takes a path to require and
 * optionally takes a caller file's directory (to enable "@super" alias).
 * Also, the function can return a path or source code of the found file if a special flag is provided.
 *
 * @param {Array<string>} layers - list of layers
 * @returns {function (string, (string|IncludeOptions)?): ?}
 *
 * @example
 * ```js
 * global.include = include(['./node_modules/bla', './']);
 *
 * // Searches the first existing file from a list:
 * // ./build/i18n
 * // ./node_modules/bla/build/i18n
 * include('build/i18n');
 *
 * // Searches the first existing file from a list:
 * // ./node_modules/bla/build/i18n
 * include('@super/build/i18n', __dirname);
 *
 * // ./node_modules/bla/build/i18n
 * include('@super/build/i18n', {ctx: __dirname});
 *
 * // Returns a path to the file
 * include('build/i18n', {return: 'path');
 *
 * // Returns the source code of the file
 * include('@super/build/i18n', {return: 'source');
 * ```
 */
module.exports = function createInclude(layers) {
	return function include(src, cwdOrOpts) {
		const
			opts = {};

		let
			cwd;

		if (Object.isDictionary(cwdOrOpts)) {
			Object.assign(opts, cwdOrOpts);
			cwd = opts.ctx;

		} else {
			cwd = cwdOrOpts;
		}

		if (opts.source) {
			opts.return = 'source';

		} else {
			opts.return = opts.return ?? 'module';
		}

		function resolve(root) {
			const
				rootAlias = /\${root}/g;

			if (rootAlias.test(src)) {
				return src.replace(rootAlias, root);
			}

			return path.join(root, src);
		}

		let
			resolvedLayers = layers;

		if (superRgxp.removeFlags('g').test(src)) {
			if (cwd == null) {
				throw new ReferenceError('A context for @super is not defined');
			}

			cwd = path.dirname(findUp.sync('.pzlrrc', {
				cwd
			}));

			resolvedLayers = resolvedLayers.slice(0, -1);

			for (let i = resolvedLayers.length; i--;) {
				if (pathEqual(cwd, resolvedLayers[i])) {
					resolvedLayers = resolvedLayers.slice(0, i);
					break;
				}
			}

			src = src.replace(superRgxp, '');
		}

		for (let i = resolvedLayers.length; i--;) {
			const
				layerSrc = resolve(resolvedLayers[i]);

			try {
				if (opts.return !== 'module' && fs.existsSync(layerSrc)) {
					return getResult(layerSrc);
				}

				if (isModuleExists(layerSrc)) {
					return require(layerSrc);
				}

			} catch (err) {
				console.error(`Failed to load ${layerSrc}`);
				throw err;
			}
		}

		return getResult(src);

		function isModuleExists(src) {
			try {
				require.resolve(src);
				return true;

			} catch {
				return false;
			}
		}

		function getResult(src) {
			switch (opts.return) {
				case 'path':
					return src;

				case 'source':
					return fs.readFileSync(src).toString();

				default:
					return require(src);
			}
		}
	};
};
