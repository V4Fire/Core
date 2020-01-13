'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

require('config');
module.exports = function (gulp = require('gulp')) {
	/**
	 * Gulp call helper
	 */
	global.callGulp = (module) => {
		if (/gulp-cli/.test(module.parent.id)) {
			gulp.init();
		}
	};

	const
		{wrapGulp} = include('build/wrap.gulp');

	wrapGulp(gulp);
	include('build/tsconfig.gulp')(gulp);
	include('build/docs.gulp')(gulp);
	include('build/other.gulp')(gulp);
	global.callGulp(module);
};

module.exports();
