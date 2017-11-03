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
GLOBAL.Any = function Any(obj: any): any {
	return obj;
};

/**
 * Infinity iterator
 */
GLOBAL.infinity = function *infinity(): IterableIterator<true> {
	while (true) {
		yield true;
	}
};

/**
 * STDERR wrapper
 * @param err
 */
GLOBAL.stderr = function stderr(err: any): void {
	console.error(err);
};
