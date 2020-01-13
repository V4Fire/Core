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
		$ = require('gulp-load-plugins')({scope: ['optionalDependencies']});

	gulp.task('build:docs:typedoc', () => $.run('typedoc')
		.exec()
		.on('error', console.error)
	);

	gulp.task('build:docs:normalise', gulp.series([
		() => gulp.src('./docs/**/*.+(html|js)')
			.pipe($.replace(/\b_+(.*?)_+(\.(?:[^\s'"/<>#]*?\.)?)html/g, '$1$2html'))
			.pipe(gulp.dest('./docs')),

		() => gulp.src('./docs/**/*.html')
			.pipe($.replace(/<\/body>/, [
				`<style>${include('assets/css/docs.css', {source: true})}</style>`,
				`<script>${include('assets/js/docs.js', {source: true})}</script>`
			].join('\n')))

			.pipe(gulp.dest('./docs')),

		() => gulp.src('./docs/**/_*.html')
			.pipe($.rename((path) => {
				path.basename = path.basename.replace(/^_+|_+(?=\.)|_+$/g, '');
			}))

			.pipe(gulp.dest('./docs')),

		() => require('del')('./docs/**/_*.html')
	]));

	gulp.task('build:docs', gulp.series(['build:tsconfig', 'build:docs:typedoc', 'build:docs:normalise']));
};
