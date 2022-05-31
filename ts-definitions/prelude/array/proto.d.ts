/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface Array<T> {
	/**
	 * Returns a new array containing elements from all specified non-primitive iterable values with duplicates removed.
	 * You can also pass non-iterable values, and they will be added to the final array,
	 * except values with `null` or `undefined`.
	 *
	 * @param args
	 */
	union<A extends Iterable<any> | any>(
		...args: Array<Iterable<A> | A>
	): A extends Iterable<infer V> ? Array<T | V> : Array<T | NonNullable<A>>;
}
