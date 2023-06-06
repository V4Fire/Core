/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/* eslint-disable @typescript-eslint/unified-signatures */

interface ObjectConstructor {
	/**
	 * Iterates over the specified dictionary
	 *
	 * @param obj - object to iterate
	 * @param opts - additional options
	 * @param cb - callback function that is called on each of object elements
	 */
	forEach<V>(
		obj: Dictionary<V>,
		opts: ObjectForEachOptions & {withDescriptors: true},
		cb: (el: ObjectForEachPropertyDescriptor<V>, key: string, data: Dictionary<V>) => any
	): void;

	/**
	 * Iterates over the specified dictionary
	 *
	 * @param obj - object to iterate
	 * @param opts - additional options
	 * @param cb - callback function that is called on each of object elements
	 */
	forEach<V>(
		obj: Dictionary<V>,
		opts: ObjectForEachOptions & ({propsToIterate: 'all' | 'notOwn'} | {withDescriptors: false}),
		cb: (el: V, key: string, data: Dictionary<V>) => any
	): void;

	/**
	 * Iterates over the specified Map object
	 *
	 * @param obj - object to iterate
	 * @param opts - additional options
	 * @param cb - callback function that is called on each of object elements
	 */
	forEach<V, K>(
		obj: Map<K, V>,
		opts: ObjectForEachOptions,
		cb: (el: V, key: K, data: Map<K, V>) => any
	): void;

	/**
	 * Iterates over the specified Map object
	 *
	 * @param obj - object to iterate
	 * @param cb - callback function that is called on each of object elements
	 * @param [opts] - additional options
	 */
	forEach<V, K>(
		obj: Map<K, V>,
		cb: (el: V, key: K, data: Map<K, V>) => any,
		opts?: ObjectForEachOptions
	): void;

	/**
	 * Iterates over the specified Set object
	 *
	 * @param obj - object to iterate
	 * @param opts - additional options
	 * @param cb - callback function that is called on each of object elements
	 */
	forEach<V>(
		obj: Set<V>,
		opts: ObjectForEachOptions,
		cb: (el: V, i: V, data: Set<V>) => any
	): void;

	/**
	 * Iterates over the specified Set object
	 *
	 * @param obj - object to iterate
	 * @param cb - callback function that is called on each of object elements
	 * @param [opts] - additional options
	 */
	forEach<V>(
		obj: Set<V>,
		cb: (el: V, i: V, data: Set<V>) => any,
		opts?: ObjectForEachOptions
	): void;

	/**
	 * Iterates over the specified array
	 *
	 * @param obj - object to iterate
	 * @param opts - additional options
	 * @param cb - callback function that is called on each of object elements
	 */
	forEach<V>(
		obj: V[],
		opts: ObjectForEachOptions,
		cb: (el: V, i: number, data: V[]) => any
	): void;

	/**
	 * Iterates over the specified array
	 *
	 * @param obj - object to iterate
	 * @param cb - callback function that is called on each of object elements
	 * @param [opts] - additional options
	 */
	forEach<V>(
		obj: V[],
		cb: (el: V, i: number, data: V[]) => any,
		opts?: ObjectForEachOptions
	): void;

	/**
	 * Iterates over the specified array-like object
	 *
	 * @param obj - object to iterate
	 * @param opts - additional options
	 * @param cb - callback function that is called on each of object elements
	 */
	forEach<V>(
		obj: ArrayLike<V>,
		opts: ObjectForEachOptions,
		cb: (el: V, i: number, data: ArrayLike<V>) => any,
	): void;

	/**
	 * Iterates over the specified array-like object
	 *
	 * @param obj - object to iterate
	 * @param cb - callback function that is called on each of object elements
	 * @param [opts] - additional options
	 */
	forEach<V>(
		obj: ArrayLike<V>,
		cb: (el: V, i: number, data: ArrayLike<V>) => any,
		opts?: ObjectForEachOptions
	): void;

	/**
	 * Iterates over the specified iterable object
	 *
	 * @param obj - object to iterate
	 * @param opts - additional options
	 * @param cb - callback function that is called on each of object elements
	 */
	forEach<V>(
		obj: Iterable<V>,
		opts: ObjectForEachOptions,
		cb: (el: V, key: null, data: Iterable<V>) => any
	): void;

	/**
	 * Iterates over the specified iterable object
	 *
	 * @param obj - object to iterate
	 * @param cb - callback function that is called on each of object elements
	 * @param [opts] - additional options
	 */
	forEach<V>(
		obj: Iterable<V>,
		cb: (el: V, key: null, data: Iterable<V>) => any,
		opts?: ObjectForEachOptions
	): void;

	/**
	 * Iterates over the specified object
	 *
	 * @param obj - object to iterate
	 * @param opts - additional options
	 * @param cb - callback function that is called on each of object elements
	 */
	forEach<V>(
		obj: Dictionary<V>,
		opts: ObjectForEachOptions,
		cb: (el: V, key: string, data: Dictionary<V>) => any
	): void;

	/**
	 * Iterates over the specified object
	 *
	 * @param obj - object to iterate
	 * @param cb - callback function that is called on each of object elements
	 * @param [opts] - additional options
	 */
	forEach<V>(
		obj: Dictionary<V>,
		cb: (el: V, key: string, data: Dictionary<V>) => any,
		opts?: ObjectForEachOptions
	): void;

	/**
	 * Iterates over the specified object
	 *
	 * @param obj - object to iterate
	 * @param opts - additional options
	 * @param cb - callback function that is called on each of object elements
	 */
	forEach<V = unknown, K = unknown, D = any>(
		obj: D,
		opts: ObjectForEachOptions,
		cb: (el: V, key: K, data: D) => any
	): void;

	/**
	 * Iterates over the specified object
	 *
	 * @param obj - object to iterate
	 * @param cb - callback function that is called on each of object elements
	 * @param [opts] - additional options
	 */
	forEach<V = unknown, K = unknown, D = any>(
		obj: D,
		cb: (el: V, key: K, data: D) => any,
		opts?: ObjectForEachOptions
	): void;
}

interface ObjectForEachOptions {
	/**
	 * If true, then the callback function takes an element descriptor instead of a value
	 *
	 * @default `false`
	 * @example
	 * ```js
	 * Object.forEach({a: 1}, {showDescriptor: true}, (el) => {
	 *   // {configurable: true, enumerable: true, writable: true, value: 1}
	 *   console.log(el);
	 * });
	 * ```
	 */
	passDescriptor?: boolean;

	/**
	 * Strategy to iterate object properties:
	 *   1. `'own'` - the object iterates only own properties (by default)
	 *   2. `'inherited'` - the object iterates only inherited properties
	 *     (for-in with the negative `hasOwnProperty` check)
	 *
	 *   3. `'all'` - the object iterates inherited properties too (for-in without the `hasOwnProperty` check)
	 *
	 * @example
	 * ```js
	 * const obj = {a: 1, __proto__: {b: 2}};
	 *
	 * Object.forEach(obj, (el) => {
	 *   console.log(el); // 1
	 * });
	 *
	 * Object.forEach(obj, {propsToIterate: 'all'}, (el) => {
	 *   console.log(el); // 1 2
	 * });
	 *
	 * Object.forEach(obj, {propsToIterate: 'inherited'}, (el) => {
	 *   console.log(el); // 2
	 * });
	 * ```
	 */
	propsToIterate?: 'own' | 'inherited' | 'all';

	/**
	 * If true, the function will iterate all object properties, but not only enumerable.
	 * Non-enumerable properties from a prototype are ignored.
	 *
	 * @default `false`
	 * @example
	 * ```js
	 * const obj = {a: 1};
	 *
	 * Object.defineProperty(obj, 'b', {value: 2});
	 *
	 * // 1
	 * // 2
	 * Object.forEach(obj, {withNonEnumerables: true}, (el) => {
	 *   console.log(el);
	 * });
	 * ```
	 */
	withNonEnumerables?: boolean;

	/**
	 * @deprecated
	 * @see [[ObjectForEachOptions.passDescriptor]]
	 */
	withDescriptor?: boolean;

	/**
	 * @deprecated
	 * @see [[ObjectForEachOptions.propsToIterate]]
	 */
	notOwn?: boolean | -1;
}

interface ObjectForEachPropertyDescriptor<V = unknown> {
	configurable?: boolean;
	enumerable?: boolean;
	value?: V;
	writable?: boolean;
	get?(): unknown;
	set?(v: unknown): void;
}
