/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { emptyArray } from 'core/prelude/array/const';

/** @see [[Array.union]] */
extend(Array.prototype, 'union', function union(
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

			if (Object.isIterable(val) && !Object.isPrimitive(val)) {
				yield* val[Symbol.iterator]();

			} else {
				yield val;
			}
		}
	}

	return [...new Set(makeIterator())];
});

/** @see [[ArrayConstructor.union]] */
extend(Array, 'union', (arr: unknown[], ...args: Array<Iterable<unknown> | unknown>) => {
	if (args.length === 0) {
		return (...args) => Array.union(arr, ...args);
	}

	return arr.union(...args);
});

/** @see [[ArrayConstructor.concat]] */
extend(Array, 'concat', (arr: unknown[], ...args: Array<CanArray<unknown>>) => {
	if (args.length === 0) {
		return (...args) => Array.concat(arr, ...args);
	}

	// Optimization for simple cases
	switch (args.length) {
		case 1:
			return arr.concat(args[0] != null ? args[0] : emptyArray);

		case 2:
			return arr.concat(
				args[0] != null ? args[0] : emptyArray,
				args[1] != null ? args[1] : emptyArray
			);

		case 3:
			return arr.concat(
				args[0] != null ? args[0] : emptyArray,
				args[1] != null ? args[1] : emptyArray,
				args[2] != null ? args[2] : emptyArray
			);

		case 4:
			return arr.concat(
				args[0] != null ? args[0] : emptyArray,
				args[1] != null ? args[1] : emptyArray,
				args[2] != null ? args[2] : emptyArray,
				args[3] != null ? args[3] : emptyArray
			);

		default: {
			const
				filteredArgs = <typeof args>[];

			for (let i = 0; i < args.length; i++) {
				const
					el = args[i];

				if (el != null) {
					filteredArgs.push(el);
				}
			}

			return arr.concat(...filteredArgs);
		}
	}
});
