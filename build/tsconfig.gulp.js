'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Registers a gulp task to generate tsconfig.json based on .tsconfig.
 * The task brings a feature to extend one tsconfig.json from another from a different project.
 * Also, this task generates URL-s for the "paths" options of the config.
 * Be sure that you run this task before trying to compile TS files.
 *
 * @example
 * ```bash
 * npx gulp build:tsconfig
 * ```
 */
module.exports = function init(gulp) {
	gulp.task('build:tsconfig', (done) => {
		require('./tsconfig');

		done();
	});
};
