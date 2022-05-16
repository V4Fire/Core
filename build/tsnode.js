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
	Module = require('module');

let
	isInitialized = false;

/**
 * Initializes the `ts-node` and `tsconfig-paths` packages
 */
module.exports = function initTsNode() {
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

	const
		// @ts-ignore
		currentVal = Module._resolveFilename;

	console.log('Module._resolveFilename will be locked and cannot be overwritten now');

	// Set a hook to prevent overwriting the path resolver function
	// For example, PW overrides _resolveFilename with its own version, which does not work correctly
	// PW also does not have an option to disable overwritten
	Object.defineProperty(Module, '_resolveFilename', {
		get() {
			return currentVal;
		},

		set() {
			// ...
		}
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

function normalizePaths(pathsMap) {
	return Object.keys(pathsMap).reduce((acc, val) => {
		const
			paths = pathsMap[val];

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
