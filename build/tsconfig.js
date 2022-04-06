/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/// <reference path="../index.d.ts"/>

// @ts-check

'use strict';

require('../lib/core');

/**
 * Builds the project `.tsconfig` file.
 * The function brings a feature to extend one `tsconfig.json` from another from a different project.
 * Also, this function generates URL-s for the `paths` options of the config.
 */
module.exports = function buildTSConfig() {
	const
		fs = require('fs'),
		find = require('find-up').sync,
		path = require('upath'),
		glob = require('glob');

	const
		tsconfig = require('tsconfig');

	const
		{config: pzlr, resolve} = require('@pzlr/build-core');

	const
		// @ts-ignore
		{src} = require('@config/config');

	const
		globOpts = {ignore: ['**/node_modules/**']};

	/** @type {string[]} */
	const paths = [
		...glob.sync('**/.tsconfig', globOpts),
		...glob.sync('**/*.tsconfig', globOpts)
	].union();

	paths.forEach((p) => {
		const
			file = fs.readFileSync(p);

		const
			config = resolveExtends(tsconfig.parse(file.toString(), p)),
			deps = {};

		const depsList = pzlr.dependencies.map((el, i) => resolve.rootDependencies[i].replace(
			new RegExp(`.*?${RegExp.escape(el)}/(.*)`),
			(str, path) => (deps[`${el}/*`] = [`${el}:${path}/*`])[0]
		));

		const
			joinPathsWithoutSrc = (p, endFolder) => path.join('/', ...p.split(path.sep).slice(0, -1), `/${endFolder}/*`),
			createNonSrcDepsPaths = (endFolder) => resolve.rootDependencies.map((p) => joinPathsWithoutSrc(p, endFolder));

		const createNonSrcParentPaths = (folders) => {
			const
				result = {};

			folders.forEach((folder) => {
				pzlr.dependencies.forEach((dep, i) => {
					result[path.join(dep, folder, '/*')] = [joinPathsWithoutSrc(resolve.rootDependencies[i], folder)];
				});
			});

			return result;
		};

		const paths = {
			'tests/*': [
				`./${src.rel('tests')}/*`,
				...createNonSrcDepsPaths('tests')
			],

			'build/*': [
				`./${src.rel('build')}/*`,
				...createNonSrcDepsPaths('build')
			],

			'*': [
				`./${src.rel('src')}/*`,
				...depsList
			],

			...createNonSrcParentPaths(['tests', 'build']),

			...deps
		};

		if (depsList.length) {
			paths[`${pzlr.super}/*`] = depsList;
		}

		Object.assign(config, {
			compilerOptions: {
				paths,
				...config.compilerOptions
			}
		});

		Object.forEach(config.compilerOptions.paths, (list) => {
			Object.forEach(list, (url, i) => {
				if (resolve.isNodeModule(url)) {
					const
						parts = url.split(':');

					if (parts.length !== 2) {
						return;
					}

					list[i] = path.join(
						path.dirname(src.lib(parts[0], 'package.json')),
						parts[1]
					);
				}
			});
		});

		const
			newPath = p.replace(/([^/\\]*?)\.tsconfig$/, (str, nm) => `${nm ? `${nm}.tsconfig` : 'tsconfig'}.json`);

		fs.writeFileSync(path.join(src.cwd(), newPath), new Buffer(JSON.stringify(config, null, 2)));

		function resolveExtends(config) {
			if (config.extends) {
				let
					parentConfig = config.extends;

				if (parentConfig.startsWith(pzlr.projectName)) {
					parentConfig = path.join(src.cwd(), parentConfig.replace(pzlr.projectName, ''));

				} else if (!resolve.isNodeModule(parentConfig)) {
					parentConfig = path.join(src.cwd(), parentConfig);
				}

				parentConfig = resolve.isNodeModule(parentConfig) ?
					find(src.lib(parentConfig)) :
					require.resolve(parentConfig);

				if (!parentConfig) {
					throw new ReferenceError(`Parent config for inheritance "${parentConfig}" is not found`);
				}

				const
					parent = resolveExtends(tsconfig.parse(fs.readFileSync(parentConfig, 'utf-8'), parentConfig));

				config = Object.mixin({
					deep: true,
					concatArrays: (a, b) => b
				}, parent, config);

				// eslint-disable-next-line no-inline-comments
				Object.forEach(config, (el, /** @type {string} */ key) => {
					if (el == null) {
						delete config[key];
						return;
					}

					if (Object.isDictionary(el)) {
						Object.forEach(el, (el, key, config) => {
							if (el == null) {
								delete config[key];
							}
						});
					}
				});
			}

			delete config.extends;
			return config;
		}
	});
};
