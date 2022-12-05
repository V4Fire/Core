/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Merges the specified arguments and returns a new object
 *
 * @param args
 */
export function merge<T>(...args: unknown[]): T {
	return Object.mixin({
		deep: true,
		concatArrays: (a: unknown[], b: unknown[]) => a.union(b),
		extendFilter: (el) => Array.isArray(el) || Object.isDictionary(el)
	}, undefined, ...args);
}
