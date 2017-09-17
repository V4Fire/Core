/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { GLOBAL } from './const/links';

/**
 * Constructor for any types
 * @param obj
 */
GLOBAL.Any = function (obj: any): any {
	return obj;
};

/**
 * Infinity iterator
 */
GLOBAL.infinity = function *() {
	while (true) {
		yield true;
	}
};

/**
 * STDERR wrapper
 * @param err
 */
GLOBAL.stderr = function (err: any) {
	console.error(err);
};
