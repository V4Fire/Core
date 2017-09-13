'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Link to the global object
 */
export const
	GLOBAL: global = Function('return this')();

/**
 * True if NodeJS runtime
 */
export const IS_NODE: boolean = (() => {
	try {
		return typeof process === 'object' && {}.toString.call(process) === '[object process]';

	} catch (_) {
		return false;
	}
})();
