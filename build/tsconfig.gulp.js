'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Registers a gulp task to generate tsconfig.json based on .tsconfig.
 * The task brings a feature to extend one tsconfig.json from another from a different project.
 * Also, this task generates URL-s for the "paths" options of the config.
 * Be sure that you run this task before trying to compile TS files.
 *
 * @example
 * ```bash
 * npx gulp build:tsconfig
 * ```
 */
module.exports = function init(gulp) {
	const
		$ = require('gulp-load-plugins')({scope: ['optionalDependencies']});

	gulp.task('build:tsconfig', () => {
		const
			$C = require('collection.js');

		const
			fs = require('fs'),
			path = require('upath'),
			find = require('find-up').sync;

		const
			tsconfig = require('tsconfig'),
			through = require('through2').obj;

		const
			{src, extend} = require('config'),
			{config: pzlr, resolve} = require('@pzlr/build-core');

		const files = [
			'./**/*.tsconfig',
			'./**/.tsconfig',
			'!./node_modules/**'
		];

		return gulp.src(files, {since: gulp.lastRun('build:tsconfig')})
			.pipe($.plumber())
			.pipe(through((file, enc, cb) => {
				const
					config = resolveExtends(tsconfig.parse(file.contents.toString(), file.path)),
					deps = {};

				const depsList = $C(pzlr.dependencies).map((el, i) => resolve.rootDependencies[i].replace(
					new RegExp(`.*?${RegExp.escape(el)}/(.*)`),
					(str, path) => (deps[`${el}/*`] = [`${el}:${path}/*`])[0]
				));

				const paths = {
					'*': [
						`./${src.rel('src')}/*`,
						...depsList
					],

					...deps
				};

				if (depsList.length) {
					paths[`${pzlr.super}/*`] = depsList;
				}

				extend(config, {
					compilerOptions: {
						paths
					}
				});

				$C(config.compilerOptions.paths).forEach((list) => {
					$C(list).forEach((url, i) => {
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

				file.path = file.path.replace(/([^/\\]*?)\.tsconfig$/, (str, nm) => `${nm ? `${nm}.tsconfig` : 'tsconfig'}.json`);
				file.contents = new Buffer(JSON.stringify(config, null, 2));

				cb(null, file);

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

						config = $C.extend({
							deep: true,
							concatArray: true,
							concatFn: (a, b) => b
						}, parent, config);

						$C(config).forEach((el, key) => {
							if (el == null) {
								delete config[key];
								return;
							}

							if (Object.isObject(el)) {
								$C(el).forEach((el, key, config) => {
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
			}))

			.pipe(gulp.dest('./'));
	});
};
