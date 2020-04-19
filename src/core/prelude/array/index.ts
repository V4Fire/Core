/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see Array.union */
extend(Array.prototype, 'union', function (
	this: unknown[],
	...args: Array<Iterable<unknown> | unknown>
): unknown[] {
	const
		that = this;

	function* makeIterator(): Iterable<unknown> {
		yield* that.values();

		for (let i = 0; i < args.length; i++) {
			const
				val = args[i];

			if (val == null) {
				continue;
			}

			if (Object.isIterable(val)) {
				yield* val[Symbol.iterator]();

			} else {
				yield val;
			}
		}
	}

	return [...new Set(makeIterator())];
});

/** @see ArrayConstructor.union */
extend(Array, 'union', (arr: unknown[], ...args: Array<Iterable<unknown> | unknown>) => {
	if (!args.length) {
		return (...args) => Array.union(arr, ...args);
	}

	if (arr == null) {
		return undefined;
	}

	return arr.union(...args);
});
