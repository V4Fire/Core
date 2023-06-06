/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

'use strict';

/**
 * Registers gulp tasks to build the project
 *
 * @example
 * ```bash
 * # Builds the application as a node.js package with the support of dynamic layers
 * npx gulp build:server
 *
 * # Builds the project as a standalone node.js package without the support of dynamic layers
 * npx gulp build:standalone
 *
 * # Builds the application as a node.js package with the support of dynamic layers and watches for changes
 * npx gulp watch:server
 *
 * # Builds the project as a standalone node.js package without the support of dynamic layers and watches for changes
 * npx gulp watch:standalone
 *
 * # Cleans the dist directory of a node.js package with the support of dynamic layers
 * npx gulp clean:server
 *
 * # Cleans the dist directory of a node.js standalone package
 * npx gulp clean:standalone
 * ```
 */
module.exports = function init(gulp) {
	const
		fs = require('fs-extra');

	const
		{src, monic} = require('@config/config'),
		{resolve} = require('@pzlr/build-core'),
		{replaceTscAliasPaths} = require('tsc-alias'),
		{depsRgxpStr} = include('build/const');

	const
		h = include('build/helpers'),
		$ = require('gulp-load-plugins')({scope: ['optionalDependencies']});

	/**
	 * Cleans the dist directory of a node.js package with the support of dynamic layers
	 */
	gulp.task('clean:server', () => require('del')(src.serverOutput()));

	/**
	 * Cleans the dist directory of a node.js standalone package
	 */
	gulp.task('clean:standalone', () => require('del')(src.standaloneOutput()));

	/**
	 * Builds the project as a node.js package with the support of dynamic layers
	 */
	gulp.task('build:server', gulp.series([gulp.parallel(['build:tsconfig', 'clean:server']), build]));

	/**
	 * Builds the project as a standalone node.js package without the support of dynamic layers
	 */
	gulp.task('build:standalone', gulp.series([
		gulp.parallel(['build:tsconfig', 'clean:standalone']),
		buildStandalone,
		replaceTscAliases
	]));

	let
		filesToBuild;

	/**
	 * Rebuilds the project as a node.js package with the support of dynamic layers
	 */
	gulp.task('build:server:rebuild', build);

	/**
	 * Rebuilds the project as a standalone node.js package without the support of dynamic layers
	 */
	gulp.task('build:standalone:rebuild', gulp.series([buildStandalone, replaceTscAliases]));

	/**
	 * Builds the project as a node.js package with the support of dynamic layers and watches for changes
	 */
	gulp.task('watch:server', gulp.series([
		'build:server',

		() => {
			gulp.watch(filesToBuild, gulp.series(['build:server:rebuild']));
		}
	]));

	/**
	 * Builds the project as a standalone node.js package without the support of dynamic layers and watches for changes
	 */
	gulp.task('watch:standalone', gulp.series([
		'build:standalone',

		() => {
			gulp.watch(filesToBuild, gulp.series(['build:standalone:rebuild']));
		}
	]));

	function baseBuild(opts = {}) {
		opts = {type: 'server', ...opts};

		const
			isPathInside = require('is-path-inside');

		const
			tsConfig = fs.readJSONSync(src.rel(`./${opts.type}.tsconfig.json`));

		filesToBuild = [
			...tsConfig.include || [],
			...resolve.rootDependencies.map((el) => `${el}/**/*.@(ts|js)`)
		];

		debugger;

		const
			isDep = new RegExp(`(^.*?(?:^|[\\/])(${depsRgxpStr}))(?:$|[\\/])`),
			enableSourcemaps = process.env.SOURCEMAPS;

		const
			requireInitializer = `/* istanbul ignore next */(${h.redefineRequire.toString()})();\n`,
			insertRequireInitializer = h.prependCode(requireInitializer);

		function dest(file) {
			const
				depDecl = isDep.exec(file.path);

			if (depDecl) {
				file.base = resolve.rootDependencies
					.find((el) => isPathInside(fs.realpathSync(el), fs.realpathSync(depDecl[1])));

				return src.lib(depDecl[2]);
			}

			file.base = src.src();
			return src[`${opts.type}Output`]();
		}

		return gulp
			.src(filesToBuild, {base: './', since: gulp.lastRun(`build:${opts.type}`)})
			.pipe($.if(enableSourcemaps, $.sourcemaps.init()))
			.pipe($.plumber())

			.pipe(
				$.monic(
					Object.mixin(true, {}, monic().typescript, {
						flags: {
							// eslint-disable-next-line camelcase
							node_js: true
						},

						sourceMaps: true
					})
				)
			)

			.pipe(
				$.babel({
					plugins: opts.type === 'server' ? [insertRequireInitializer] : [],
					comments: false
				})
			)

			.pipe($.if(enableSourcemaps, $.sourcemaps.write('.')))
			.pipe(gulp.dest(dest));
	}

	function buildStandalone() {
		return baseBuild({type: 'standalone'});
	}

	function replaceTscAliases() {
		return replaceTscAliasPaths({
			configFile: src.rel('./standalone.tsconfig.json'),
			outDir: src.rel('standaloneOutput')
		});
	}

	function build() {
		return baseBuild();
	}
};
