/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see Array.union */
extend(Array.prototype, 'union', function (this: unknown[], ...args: unknown[][]): unknown[] {
	return [...new Set(this.concat(...args))];
});

/** @see ArrayConstructor.union */
extend(Array, 'union', (arr: Nullable<unknown[]>, ...args: unknown[][]) => {
	if (!args.length) {
		return (...args) => Array.union(arr, ...args);
	}

	if (arr == null) {
		return undefined;
	}

	return arr.union(...args);
});
