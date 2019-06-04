/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/**
 * Returns a new array containing elements in all specified arrays with duplicates removed
 * (unlike Sugar.Array.union without deep check)
 *
 * @param args
 */
extend(Array.prototype, 'union', function (this: unknown[], ...args: unknown[]): unknown[] {
	return [...new Set(this.concat(...args))];
});
