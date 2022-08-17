'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

const
	path = require('path');

globalThis.isProd = false;
globalThis.include = require;

Object.defineProperties(globalThis, {
	include: {
		get() {
			return require(path.join(process.cwd(), 'config/default')).src.include();
		}
	},

	API_URL: {
		get() {
			return require('@config/config').apiURL();
		}
	},

	isProd: {
		get() {
			return require('@config/config').environment === 'production';
		}
	},

	IS_PROD: {
		get() {
			return isProd;
		}
	}
});
