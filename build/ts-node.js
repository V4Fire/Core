// @ts-check

'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

const
	tsNode = require('ts-node'),
	tsPaths = require('tsconfig-paths');

const
	path = require('upath'),
	process = require('process');

let
	isInitialized = false;

/**
 * Initializes the `ts-node` and `tsconfig-paths` packages
 */
module.exports = () => {
	if (isInitialized) {
		return;
	}

	const
		tsConfig = require(path.join(process.cwd(), '/client.tsconfig.json'));

	tsPaths.register({
		baseUrl: tsConfig.compilerOptions.baseUrl,
		paths: normalizePaths(tsConfig.compilerOptions.paths)
	});

	tsNode.register({
		transpileOnly: true,

		compilerOptions: {
			module: 'CommonJS'
		}
	});

	isInitialized = true;
};

function normalizePaths(p) {
	return Object.keys(p).reduce((acc, val) => {
		const
			paths = p[val];

		acc[val] = paths.map((pathEl) => {
			const
				normalizedPath = path.normalize(pathEl),
				normalizedCwd = path.normalize(process.cwd());

			if (path.isAbsolute(normalizedPath)) {
				return normalizedPath.replace(normalizedCwd, '');
			}

			return normalizedPath;
		});

		return acc;

	}, {});
}
