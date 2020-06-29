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
		path = require('path');

	const
		{src} = require('config'),
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

		cache[url] = require.resolve(url);
		return staticRequire(url);
	};

	require.cache = staticRequire.cache;
	require.extensions = staticRequire.extensions;
	require.main = staticRequire.main;

	// @ts-ignore
	require.resolve = (url, opts) => {
		if (resolve.isNodeModule(url)) {
			let
				resolveUrl;

			for (let i = 0; i < deps.length + 1; i++) {
				try {
					if (i) {
						resolveUrl = staticRequire.resolve(path.join(lib, deps[i - 1], url), opts);

					} else {
						resolveUrl = staticRequire.resolve(path.join(outputDest, url), opts);
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
};
