'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

require('@config/config');

/**
 * Initializes the specified gulp instance.
 * This helper brings a feature to extends one gulp config from another.
 *
 * @param gulp - link to the gulp module
 *
 * @example
 * ```js
 * require('@config/config');
 *
 * module.exports = function (gulp = require('gulp')) {
 *   // Include the parent config
 *   include('@super/gulpfile', __dirname)(gulp);
 *
 *   // Register own tasks
 *   include('build/my-extra-gulp-tasks')(gulp);
 *
 *   // Call the special method to initialize registered tasks
 *   global.callGulp(module);
 * };
 *
 * module.exports();
 * ```
 */
module.exports = function initGulp(gulp = require('gulp')) {
	/**
	 * The global helper to initialize gulp tasks
	 */
	globalThis.callGulp = (module) => {
		if (/gulp-cli/.test(module.parent.id)) {
			gulp.init();
		}
	};

	const {wrapGulp} = include('build/wrap.gulp');
	wrapGulp(gulp);

	include('build/tsconfig.gulp')(gulp);
	include('build/build.gulp')(gulp);
	include('build/doc.gulp')(gulp);
	include('build/other.gulp')(gulp);

	globalThis.callGulp(module);
};

module.exports();
