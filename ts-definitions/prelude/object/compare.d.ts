/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface ObjectConstructor {
	/**
	 * Returns a curried version of `Object.fastCompare` for one argument
	 * @param a
	 */
	fastCompare(a: any): (b: any) => boolean;

	/**
	 * Compares two specified objects by using a naive but fast `JSON.stringify/parse` strategy and
	 * returns true if they are equal.
	 *
	 * Mind, that this method uses non-stable version `JSON.stringify`, i.e.,
	 * it can work incorrectly with object like `{a: 1, b: 2}` and `{b: 2, a: 1}`.
	 *
	 * Be careful with comparing `undefined` and `NaN` values, as they can be converted to `null` due to
	 * the nature of `JSON.stringify`.
	 *
	 * @param a
	 * @param b
	 */
	fastCompare<T>(a: any, b: T): a is T;

	/**
	 * Returns a hash sum of the specified object by using a naive but fast `JSON.stringify` strategy.
	 *
	 * Mind, that this method uses non-stable version `JSON.stringify`, i.e.,
	 * it can work incorrectly with object like `{a: 1, b: 2}` and `{b: 2, a: 1}`.
	 *
	 * Be careful with comparing `undefined` and `NaN` values, as they can be converted to `null` due to
	 * the nature of `JSON.stringify`.
	 *
	 * @param obj
	 */
	fastHash(obj: any): string;
}
