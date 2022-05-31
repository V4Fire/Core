/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface ObjectConstructor {
	/**
	 * Returns size/length of the specified object
	 *
	 * @param obj
	 *
	 * @example
	 * ```js
	 * // 1
	 * Object.size({a: 1});
	 *
	 * // 2
	 * Object.size([1, 2]);
	 *
	 * // 2
	 * Object.size(new Set([1, 2]));
	 *
	 * // 2
	 * Object.size((a, b) => a + b));
	 *
	 * // 1
	 * Object.size(1);
	 *
	 * // 0
	 * Object.size(NaN);
	 * Object.size(null);
	 * Object.size(undefined);
	 * ```
	 */
	size(obj: any): number;
}
