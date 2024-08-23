/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see [[Array.union]] */
extend(Array.prototype, 'union', function union(
	this: unknown[],
	...args: Array<Iterable<unknown> | unknown>
): unknown[] {
	const that = this;

	function* makeIterator(): Iterable<unknown> {
		yield* that.values();

		for (const val of args) {
			if (val == null) {
				continue;
			}

			if (Object.isIterable(val) && !Object.isPrimitive(val)) {
				yield* Object.cast(val[Symbol.iterator]());

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
			return arr.concat(args[0] != null ? args[0] : []);

		case 2:
			return arr.concat(
				args[0] != null ? args[0] : [],
				args[1] != null ? args[1] : []
			);

		case 3:
			return arr.concat(
				args[0] != null ? args[0] : [],
				args[1] != null ? args[1] : [],
				args[2] != null ? args[2] : []
			);

		case 4:
			return arr.concat(
				args[0] != null ? args[0] : [],
				args[1] != null ? args[1] : [],
				args[2] != null ? args[2] : [],
				args[3] != null ? args[3] : []
			);

		default: {
			const res = <typeof args>[];

			args.forEach((val) => {
				if (val != null) {
					if (Array.isArray(val)) {
						res.push(...val);

					} else {
						res.push(val);
					}
				}
			});

			return res;
		}
	}
});

extend(Array, 'toArray', (...args: Array<CanArray<unknown>>) => {
	// Optimization for simple cases
	switch (args.length) {
		case 0:
			return [];

		case 1:
			if (args[0] == null) {
				return [];
			}

			return Array.isArray(args[0]) ? args[0] : [args[0]];

		case 2: {
			const res = <typeof args>[];

			if (args[0] != null) {
				if (Array.isArray(args[0])) {
					res.push(...args[0]);

				} else {
					res.push(args[0]);
				}
			}

			if (args[1] != null) {
				if (Array.isArray(args[1])) {
					res.push(...args[1]);

				} else {
					res.push(args[1]);
				}
			}

			return res;
		}

		case 3: {
			const res = <typeof args>[];

			if (args[0] != null) {
				if (Array.isArray(args[0])) {
					res.push(...args[0]);

				} else {
					res.push(args[0]);
				}
			}

			if (args[1] != null) {
				if (Array.isArray(args[1])) {
					res.push(...args[1]);

				} else {
					res.push(args[1]);
				}
			}

			if (args[2] != null) {
				if (Array.isArray(args[2])) {
					res.push(...args[2]);

				} else {
					res.push(args[2]);
				}
			}

			return res;
		}

		case 4: {
			const res = <typeof args>[];

			if (args[0] != null) {
				if (Array.isArray(args[0])) {
					res.push(...args[0]);

				} else {
					res.push(args[0]);
				}
			}

			if (args[1] != null) {
				if (Array.isArray(args[1])) {
					res.push(...args[1]);

				} else {
					res.push(args[1]);
				}
			}

			if (args[2] != null) {
				if (Array.isArray(args[2])) {
					res.push(...args[2]);

				} else {
					res.push(args[2]);
				}
			}

			if (args[3] != null) {
				if (Array.isArray(args[3])) {
					res.push(...args[3]);

				} else {
					res.push(args[3]);
				}
			}

			return res;
		}

		default: {
			const res = <typeof args>[];

			args.forEach((val) => {
				if (val != null) {
					if (Array.isArray(val)) {
						res.push(...val);

					} else {
						res.push(val);
					}
				}
			});

			return res;
		}
	}
});
