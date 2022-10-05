'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

const
	fs = require('fs'),
	path = require('upath');

const
	template = require('@babel/template').default,
	{ensureStatementsHoisted} = require('@babel/helper-module-transforms');

/**
 * Returns the project meta information
 * @returns {{name: string, version: string}}
 */
exports.getProjectInfo = function getProjectInfo() {
	const info = include('package.json');
	return Object.select(info, ['name', 'version']);
};

/**
 * Returns the project disclaimer
 * @param {boolean=} [withVersion]
 * @returns {string}
 */
exports.getHead = function getHead(withVersion) {
	return fs
		.readFileSync(path.join(process.cwd(), 'disclaimer.txt'), 'utf-8')
		.replace(/\* (\w.*?)(?=\n)/, (str) => str + (withVersion ? ` v${exports.getProjectInfo().version}` : ''));
};

/**
 * Redefines global require functions to add support of WebPack layers
 */
exports.redefineRequire = function redefineRequire() {
	const
		path = require('upath');

	const
		{src} = require('@config/config'),
		{config: pzlr, resolve} = require('@pzlr/build-core');

	const
		staticRequire = require,
		cache = Object.create(null);

	const
		outputDest = src.serverOutput();

	const
		lib = path.join(outputDest, 'node_modules'),
		deps = pzlr.dependencies;

	// @ts-ignore
	// eslint-disable-next-line no-global-assign
	require = (url) => {
		if (url in cache) {
			return staticRequire(cache[url]);
		}

		const resolvedURL = require.resolve(url);
		cache[url] = resolvedURL;
		return staticRequire(resolvedURL);
	};

	require.cache = staticRequire.cache;
	require.extensions = staticRequire.extensions;
	require.main = staticRequire.main;

	require.resolve = (url, opts) => {
		if (resolve.isNodeModule(url)) {
			let
				resolveUrl;

			for (let i = 0; i < deps.length + 1; i++) {
				try {
					if (i === 0) {
						resolveUrl = staticRequire.resolve(path.join(outputDest, url), opts);

					} else {
						resolveUrl = staticRequire.resolve(path.join(lib, deps[i - 1], url), opts);
					}

					break;

				} catch {}
			}

			if (resolveUrl) {
				return resolveUrl;
			}
		}

		return staticRequire.resolve(url, opts);
	};

	require('core/prelude');
};

/**
 * Babel plugin to insert code into the beginning of a file
 * @param {string} code
 * @returns {Function}
 */
exports.prependCode = function prependCode(code) {
	return function prependCode() {
		return {
			visitor: {
				Program: {
					exit(path) {
						const node = template.ast(code, {preserveComments: true});
						ensureStatementsHoisted([node]);
						path.unshiftContainer('body', node);
					}
				}
			}
		};
	};
};
