/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Then from 'core/then';

/**
 * Wrapper for async functions:
 * caches running requests and, for several identical queries in a row,
 * returns the forks of the result (promise) of the first of them
 *
 * @param fn - asynchronous function, which we wrap
 * @param keyGen - key generator for the cache
 */
export function mergePendingWrapper<T extends Function>(
	fn: T,
	keyGen: (...args: any[]) => string = (...args) => JSON.stringify(args)
): T {
	const
		cache = Object.createDict();

	return <any>function (...args: any[]): any {
		const
			key = keyGen(...args);

		if (!cache[key]) {
			const
				val = <Then<any>>fn.apply(this, args);

			if (Then.isThenable(val)) {
				cache[key] = val.then(
					(v) => {
						delete cache[key];
						return v;
					},

					(r) => {
						delete cache[key];
						throw r;
					},

					() => {
						delete cache[key];
					}
				);

			} else {
				return val;
			}
		}

		return cache[key].then();
	};
}
