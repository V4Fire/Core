/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

'use strict';

export const
	GLOBAL = Function('return this')();

export const IS_NODE = (() => {
	try {
		return typeof process === 'object' && {}.toString.call(process) === '[object process]';

	} catch (_) {
		return false;
	}
})();
