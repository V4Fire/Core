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
		$ = require('gulp-load-plugins')();

	/**
	 * The task for setting NODE_ENV to production
	 */
	gulp.task('setProd', (cb) => {
		process.env.NODE_ENV = 'production';
		global.isProd = true;
		cb();
	});

	/**
	 * The task for updating copyrights
	 */
	gulp.task('copyright', () =>
		gulp.src('./LICENSE', {since: gulp.lastRun('copyright')})
			.pipe($.plumber())
			.pipe($.replace(/(Copyright \(c\) )(\d+)-?(\d*)/, (str, intro, from, to) => {
				const year = new Date().getFullYear();
				return intro + from + (to || from !== year ? `-${year}` : '');
			}))

			.pipe(gulp.dest('./'))
	);

	/**
	 * The task for updating head disclaimers
	 */
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
			'./index.d.ts'
		];

		return gulp.src(src, {base: './', since: gulp.lastRun('head')})
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
};
