/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

// @ts-check

'use strict';

const
	tsNode = require('ts-node'),
	tsPaths = require('tsconfig-paths');

const
	path = require('upath');

let
	isInitialized = false;

/**
 * Initializes the `ts-node` and `tsconfig-paths` packages
 */
module.exports = function initializeTsNode() {
	if (isInitialized) {
		return;
	}

	let
		tsConfig;

	try {
		tsConfig = require(path.join(process.cwd(), '/tsconfig.json'));

	} catch (err) {
		if (err.code === 'MODULE_NOT_FOUND') {
			throw new ReferenceError('No tsconfig.json found. Generate it with "node node_modules/@v4fire/core/build/tsconfig".');
		}

		throw err;
	}

	tsPaths.register({
		baseUrl: tsConfig.compilerOptions.baseUrl,
		paths: normalizePaths(tsConfig.compilerOptions.paths),
		addMatchAll: false
	});

	tsNode.register({
		transpileOnly: true,

		compilerOptions: {
			module: 'commonjs',
			target: 'es2021'
		},

		ignore: [],

		swc: true
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

module.exports();
