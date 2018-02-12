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
		path = require('path');

	gulp.task('build:tsconfig', () => {
		const
			tsconfig = require('tsconfig'),
			through = require('through2').obj;

		return gulp.src(['./**/*.tsconfig', './**/.tsconfig', '!./node_modules/**'], {since: gulp.lastRun('build:tsconfig')})
			.pipe($.plumber())
			.pipe(through((file, enc, cb) => {
				const resolveExtends = (config) => {
					if (config.extends) {
						const parentSrc = require.resolve(
							/^\.?[/\\]/.test(config.extends) ? path.resolve(process.cwd(), config.extends) : config.extends
						);

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
				};

				const
					config = tsconfig.parse(file.contents.toString(), file.path);

				file.path = file.path.replace(/([^/\\]*?)\.tsconfig$/, (str, nm) => `${nm ? `${nm}.tsconfig` : 'tsconfig'}.json`);
				file.contents = new Buffer(JSON.stringify(resolveExtends(config), null, 2));

				cb(null, file);
			}))

			.pipe(gulp.dest('./'));
	});
};
