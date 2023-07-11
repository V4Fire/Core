/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface ArrayConstructor {
	/**
	 * Returns a curried version of `Array.union`
	 * @param arr
	 */
	union<T extends Nullable<any[]>>(arr: T): <A extends Iterable<any> | any>(
		...args: Array<Iterable<A> | A>
	) => A extends Iterable<infer V> ?
		Array<IterableType<NonNullable<T>> | V> :
		Array<IterableType<NonNullable<T>> | NonNullable<A>>;

	/**
	 * Returns a new array containing elements from all specified non-primitive iterable values with duplicates removed.
	 * You can also pass non-iterable values, and they will be added to the final array,
	 * except values with `null` or `undefined`.
	 *
	 * @param arr
	 * @param args
	 */
	union<T extends Nullable<any[]>, A extends Iterable<any> | any>(
		arr: T,
		...args: Array<Iterable<A> | A>
	): A extends Iterable<infer V> ?
		Array<IterableType<NonNullable<T>> | V> :
		Array<IterableType<NonNullable<T>> | NonNullable<A>>;

	/**
	 * Returns a curried version of `Array.concat`
	 * @param arr
	 */
	concat<T extends Nullable<any[]>>(arr: T): <A extends CanArray<any>>(...args: Array<CanArray<A>>) =>
		A extends Array<infer V> ?
			Array<IterableType<NonNullable<T>> | V> :
			Array<IterableType<NonNullable<T>> | NonNullable<A>>;

	/**
	 * Returns a new array containing elements from all specified arrays.
	 * You can also pass non-iterable values, and they will be added to the final array,
	 * except values with `null` or `undefined`.
	 *
	 * @param arr
	 * @param args
	 */
	concat<T extends Nullable<any[]>, A extends CanArray<any>>(
		arr: T,
		...args: Array<CanArray<A>>
	): A extends Array<infer V> ?
		Array<IterableType<NonNullable<T>> | V> :
		Array<IterableType<NonNullable<T>> | NonNullable<A>>;
}
