'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

const
	gulp = require('gulp'),
	{getHead} = require('./build/helpers');

module.exports = (gulp) => {
	gulp.task('setProd', (cb) => {
		process.env.NODE_ENV = 'production';
		cb();
	});

	gulp.task('copyright', (cb) => {
		const
			replace = require('gulp-replace');

		gulp.src('./LICENSE')
			.pipe(replace(/(Copyright \(c\) )(\d+)-?(\d*)/, (str, intro, from, to) => {
				const year = new Date().getFullYear();
				return intro + from + (to || from !== year ? `-${year}` : '');
			}))

			.pipe(gulp.dest('./'))
			.on('end', cb);
	});

	gulp.task('lf', (cb) => {
		const
			convertNewline = require('gulp-convert-newline');

		const src = [
			'./@(src|config|build|web_loaders)/**/*',
			'./*'
		];

		gulp.src(src, {base: './'})
			.pipe(convertNewline())
			.pipe(gulp.dest('./'))
			.on('end', cb);
	});

	gulp.task('head', (cb) => {
		const
			through = require('through2'),
			fullHead = `${getHead()}\n`,
			headRgxp = /(\/\*![\s\S]*?\*\/\n{2})/;

		const src = [
			'./@(src|config|build|web_loaders)/**/*.@(js|styl|ss)',
			'./@(index|gulpfile|webpack.config).js'
		];

		gulp.src(src, {base: './'})
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
						useStrict = /^('|")use strict\1;\n+/;

					if (useStrict.test(contents)) {
						file.contents = new Buffer(contents.replace(useStrict, (str) => str + fullHead));

					} else {
						file.contents = new Buffer(fullHead + contents);
					}

					this.push(file);
				}


				return cb();
			}))

			.pipe(gulp.dest('./'))
			.on('end', cb);
	});
};

module.exports(gulp);
