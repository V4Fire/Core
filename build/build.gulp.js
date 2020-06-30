'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Registers gulp tasks to build the project
 *
 * @example
 * ```bash
 * # Builds the application as a node.js package
 * npx gulp build:server
 *
 * # Builds the application as a node.js package and watches for changes
 * npx gulp watch:server
 *
 * # Cleans the dist directory of a node.js package
 * npx gulp clean:server
 * ```
 */
module.exports = function init(gulp) {
	const
		fs = require('fs-extra-promise');

	const
		{src, monic} = require('config'),
		{resolve} = require('@pzlr/build-core'),
		{depsRgxpStr} = include('build/const');

	const
		h = include('build/helpers'),
		$ = require('gulp-load-plugins')({scope: ['optionalDependencies']});

	/**
	 * Cleans the dist directory of a node.js package
	 */
	gulp.task('clean:server', () => require('del')(src.serverOutput()));

	/**
	 * Builds the project as a node.js package
	 */
	gulp.task('build:server', gulp.series([gulp.parallel(['build:tsconfig', 'clean:server']), build]));

	/**
	 * Rebuilds the project as a node.js package
	 */
	gulp.task('build:server:rebuild', build);

	/**
	 * Builds the project as a node.js package and watches for changes
	 */
	gulp.task('watch:server', gulp.series([
		'build:server',

		() => {
			gulp.watch(filesToBuild, gulp.series(['build:server:rebuild']));
		}
	]));

	let
		tsProject;

	function build() {
		const
			$C = require('collection.js'),
			isPathInside = require('is-path-inside');

		tsProject = tsProject || $.typescript.createProject(src.rel('./server.tsconfig.json'), {noEmitOnError: false});

		const
			tsConfig = fs.readJSONSync(src.rel('./server.tsconfig.json')),
			filesToBuild = [...tsConfig.include || [], ...resolve.rootDependencies.map((el) => `${el}/**/*.@(ts|js)`)];

		const
			isDep = new RegExp(`(^.*?(?:^|[\\/])(${depsRgxpStr}))(?:$|[\\/])`),
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

		console.log(dest);

		return gulp.src(filesToBuild, {base: './', since: gulp.lastRun('build:server')})
			.pipe($.plumber())

			.pipe($.monic($C.extend(true, {}, monic().typescript, {
				flags: {
					// eslint-disable-next-line camelcase
					node_js: true
				},

				replacers: [(text) => requireInitializer + text]
			})))

			.pipe(tsProject())
			.js

			.pipe(gulp.dest(dest));
	}
};
