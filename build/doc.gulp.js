'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Registers gulp tasks to generate HTML documentation based on the project
 *
 * @param {import('gulp')} gulp
 *
 * @example
 * ```bash
 * npx gulp build:docs
 * ```
 */
module.exports = function init(gulp) {
	const
		$ = require('gulp-load-plugins')({scope: ['optionalDependencies']});

	/**
	 * Builds an HTML files by using typedoc
	 */
	gulp.task('build:doc:typedoc', () => $.run('typedoc')
		.exec()
		.on('error', console.error));

	/**
	 * Normalizes generated HTML files: attaches extra styles and js, removes some trash
	 * @returns {void}
	 */
	gulp.task('build:doc:normalize', gulp.series([
		() => gulp.src('./docs/**/*.+(html|js|json)')
			.pipe($.replace(/(['"/\\])_+(.+?)_+(\.(?:[^\s'"/\\<>#.]+\.)?html\b)/g, (...str) => str.slice(1, 4).join('')))
			.pipe(gulp.dest('./docs')),

		() => gulp.src('./docs/**/*.html')
			.pipe($.replace(/<\/head>/, [
				`<style>${include('assets/css/docs.css', {source: true})}</style>`,
				'</head>'
			].join('\n')))

			.pipe($.replace(/<body>/, [
				'<body>',
				`<script>${include('assets/js/config.js', {source: true})}</script>`
			].join('\n')))

			.pipe($.replace(/<\/body>/, [
				`<script>${include('assets/js/docs.js', {source: true})}</script>`,
				'</body>'
			].join('\n')))

			.pipe(gulp.dest('./docs')),

		() => gulp.src('./docs/**/_*.html')
			.pipe($.rename((path) => {
				path.basename = path.basename.replace(/^_+|_+(?=\.)|_+$/g, '');
			}))

			.pipe(gulp.dest('./docs')),

		() => require('del')('./docs/**/_*.html')
	]));

	/**
	 * The main task to generate documentation
	 */
	gulp.task('build:doc', gulp.series(['build:tsconfig', 'build:doc:typedoc', 'build:doc:normalize']));
};
