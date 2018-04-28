'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

module.exports = function (gulp) {
	const
		$C = require('collection.js'),
		$ = require('gulp-load-plugins')({scope: ['optionalDependencies']});

	const
		fs = require('fs'),
		path = require('path'),
		find = require('find-up').sync;

	gulp.task('build:tsconfig', () => {
		const
			tsconfig = require('tsconfig'),
			through = require('through2').obj;

		return gulp.src(['./**/*.tsconfig', './**/.tsconfig', '!./node_modules/**'], {since: gulp.lastRun('build:tsconfig')})
			.pipe($.plumber())
			.pipe(through((file, enc, cb) => {
				const
					config = resolveExtends(tsconfig.parse(file.contents.toString(), file.path));

				$C($C(config).get('compilerOptions.paths')).forEach((list) => {
					$C(list).forEach((url, i) => {
						if (isNodeModule(url)) {
							const
								parts = url.split(':');

							if (parts.length !== 2) {
								return;
							}

							list[i] = path.join(
								path.dirname(find(path.join('node_modules', parts[0], 'package.json'))),
								parts[1]
							);
						}
					});
				});

				file.path = file.path.replace(/([^/\\]*?)\.tsconfig$/, (str, nm) => `${nm ? `${nm}.tsconfig` : 'tsconfig'}.json`);
				file.contents = new Buffer(JSON.stringify(config, null, 2));
				cb(null, file);

				function isNodeModule(url) {
					return /^[^.]/.test(url) && !path.isAbsolute(url);
				}

				function resolveExtends(config) {
					if (config.extends) {
						const parentSrc = isNodeModule(config.extends) ?
							find(path.join('node_modules', config.extends)) : require.resolve(config.extends);

						const
							parent = resolveExtends(tsconfig.parse(fs.readFileSync(parentSrc, 'utf-8'), parentSrc));

						config = $C.extend(/** @type {?} */ {
							deep: true,
							concatArray: true,
							concatFn: (a, b) => b
						}, parent, config);
					}

					delete config.extends;
					return config;
				}
			}))

			.pipe(gulp.dest('./'));
	});
};
