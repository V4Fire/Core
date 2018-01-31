'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

require('config');
module.exports = function (gulp = require('gulp')) {
	const
		fs = require('fs'),
		path = require('path'),
		$ = require('gulp-load-plugins')({scope: ['optionalDependencies']});

	gulp.task('setProd', (cb) => {
		process.env.NODE_ENV = 'production';
		global.isProd = true;
		cb();
	});

	gulp.task('copyright', () =>
		gulp.src('./LICENSE')
			.pipe($.plumber())
			.pipe($.replace(/(Copyright \(c\) )(\d+)-?(\d*)/, (str, intro, from, to) => {
				const year = new Date().getFullYear();
				return intro + from + (to || from !== year ? `-${year}` : '');
			}))

			.pipe(gulp.dest('./'))
	);

	gulp.task('lf', () => {
		const src = [
			'./@(src|config|build|ts-definitions)/**/*',
			'./*'
		];

		return gulp.src(src, {base: './'})
			.pipe($.plumber())
			.pipe($.convertNewline())
			.pipe(gulp.dest('./'));
	});

	gulp.task('head', () => {
		const
			through = require('through2'),
			{getHead} = include('build/helpers');

		const
			fullHead = `${getHead()}\n`,
			headRgxp = /(\/\*![\s\S]*?\*\/\n{2})/;

		const src = [
			'./@(src|config|build|ts-definitions)/**/*.@(js|ts|styl|ss)',
			'./@(index|gulpfile|webpack.config).js',
			'./predefs.d.ts'
		];

		return gulp.src(src, {base: './'})
			.pipe(through.obj(function (file, enc, cb) {
				const
					contents = file.contents.toString(),
					header = headRgxp.exec(contents);

				if (header) {
					if (header[0] !== fullHead) {
						file.contents = new Buffer(contents.replace(headRgxp, fullHead));
						this.push(file);
					}

				} else {
					const
						useStrict = /^(['"])use strict\1;\n+/;

					if (useStrict.test(contents)) {
						file.contents = new Buffer(contents.replace(useStrict, (str) => str + fullHead));

					} else {
						file.contents = new Buffer(fullHead + contents);
					}

					this.push(file);
				}

				return cb();
			}))

			.pipe(gulp.dest('./'));
	});

	gulp.task('build:tsconfig', () => {
		const
			cwd = process.cwd(),
			tsconfig = require('tsconfig'),
			through = require('through2');

		return gulp.src(['./**/*.tsconfig', './**/.tsconfig'], {since: gulp.lastRun('build:tsconfig')})
			.pipe($.plumber())
			.pipe(through.obj((file, enc, cb) => {
				const resolveExtends = (config) => {
					if (config.extends) {
						const parentSrc = require.resolve(
							/^\.?[/\\]/.test(config.extends) ? path.resolve(cwd, config.extends) : config.extends
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

module.exports();
