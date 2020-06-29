'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Registers gulp tasks to build the application
 *
 * @example
 * ```bash
 * # Compiles TS files
 * npx gulp build:ts
 * ```
 */
module.exports = function init(gulp) {
	const
		{src, monic} = require('config');

	const
		$ = require('gulp-load-plugins')({scope: ['optionalDependencies']});

	/**
	 * Cleans the dist directory
	 */
	gulp.task('build:ts:clean', () => require('del')(src.serverOutput()));

	/**
	 * Compiles TS files
	 */
	gulp.task('build:ts', gulp.series([gulp.parallel(['build:tsconfig', 'build:ts:clean']), buildTS]));

	let tsProject;
	function buildTS() {
		const
			fs = require('fs-extra-promise'),
			isPathInside = require('is-path-inside');

		const
			h = include('build/helpers'),
			tsConfig = fs.readJSONSync('./server.tsconfig.json');

		const
			{resolve} = require('@pzlr/build-core'),
			{depsRgxpStr} = include('build/const');

		tsProject = tsProject || $.typescript.createProject('./server.tsconfig.json', {noEmitOnError: false});

		const
			files = [...tsConfig.include || [], ...resolve.rootDependencies.map((el) => `${el}/**/*.ts`)],
			isDep = new RegExp(`(^.*?(?:^|[\\/])(${depsRgxpStr}))(?:$|[\\/])`);

		const
			requireInitializer = `(${h.redefineRequire.toString()})();\n`;

		function dest(file) {
			const
				depDecl = isDep.exec(file.path);

			if (depDecl) {
				file.base = $C(resolve.rootDependencies).one.get((el) => isPathInside(el, depDecl[1]));
				return src.lib(depDecl[2]);
			}

			file.base = src.src();
			return src.serverOutput();
		}

		return gulp.src(files, {base: './', since: gulp.lastRun('build:ts')})
			.pipe($.plumber())

			.pipe($.monic({
				flags: {
					...monic().typescript,

					// eslint-disable-next-line camelcase
					node_js: true
				},

				replacers: [(text) => requireInitializer + text]
			}))

			.pipe(tsProject())
			.js

			.pipe(gulp.dest(dest));
	}
};
