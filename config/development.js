/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

'use strict';

const
	config = include('config/default');

module.exports = config.createConfig({dirs: [__dirname], mod: null}, {
	__proto__: config
});
