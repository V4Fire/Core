/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

'use strict';

/**
 * Registers some helper gulp tasks
 *
 * @example
 * ```bash
 * # The task sets NODE_ENV environment variable to "production"
 * npx gulp setProd
 *
 * # Updates or adds head disclaimers to all files from the project
 * npx gulp head
 * ```
 */
module.exports = function init(gulp) {
	/**
	 * Sets NODE_ENV to production
	 */
	gulp.task('setProd', (cb) => {
		process.env.NODE_ENV = 'production';
		globalThis.isProd = true;
		cb();
	});

	/**
	 * Updates or adds head disclaimers to all files from the project
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
			.pipe(through.obj(function thread(file, enc, cb) {
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
