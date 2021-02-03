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
	fs = require('fs'),
	path = require('upath'),
	findUp = require('find-up'),
	{pathEqual} = require('path-equal');

/**
 * Returns a function to attach modules withing node.js process with the support of WebPack "layers".
 * The returned function takes a path to require, and, also, can take a directory of the caller file
 * (to enable "@super" alias).
 *
 * @param {Array<string>} layers - list of layers
 * @returns {function (string, string?): ?}
 *
 * @example
 * ```js
 * global.include = include(['./', './node_modules/bla']);
 *
 * // Searches the first existed file from a list:
 * // ./build/i18n
 * // ./node_modules/bla/build/i18n
 * include('build/i18n');
 *
 * // Searches the first existed file from a list:
 * // ./node_modules/bla/build/i18n
 * include('@super/build/i18n', __dirname);
 * ```
 */
module.exports = function init(layers) {
	return function include(src, ctx) {
		const
			opts = {};

		if (Object.isObject(ctx)) {
			Object.assign(opts, ctx);
			ctx = undefined;
		}

		function resolve(root) {
			const
				rootAlias = /\${root}/g;

			if (rootAlias.test(src)) {
				return src.replace(rootAlias, root);
			}

			return path.join(root, src);
		}

		function moduleExists(src) {
			try {
				require.resolve(src);
				return true;

			} catch {
				return false;
			}
		}

		let
			resolvedLayers = layers;

		if (superRgxp.setFlags('').test(src)) {
			if (!ctx) {
				throw new ReferenceError('The context for @super is not defined');
			}

			ctx = path.dirname(findUp.sync('.pzlrrc', {
				cwd: ctx
			}));

			resolvedLayers = resolvedLayers.slice(0, -1);

			for (let i = resolvedLayers.length; i--;) {
				if (pathEqual(ctx, resolvedLayers[i])) {
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
				if (opts.source) {
					if (fs.existsSync(layerSrc)) {
						return fs.readFileSync(layerSrc).toString();
					}

				} else if (moduleExists(layerSrc)) {
					return require(layerSrc);
				}

			} catch (err) {
				console.error(`Failed to load ${layerSrc}`);
				throw err;
			}
		}

		if (opts.source) {
			return fs.readFileSync(src).toString();
		}

		require(src);
	};
};
