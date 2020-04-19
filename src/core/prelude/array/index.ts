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
	function* makeIterator(): Iterable<unknown> {
		yield* this.values();

		for (let i = 0; i < args.length; i++) {
			const
				val = args[i];

			if (val == null) {
				continue;
			}

			if (Object.isArray(val)) {
				yield* val.values();
			}

			yield val;
		}
	}

	return [...new Set(makeIterator())];
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
