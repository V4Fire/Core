/* eslint-disable @typescript-eslint/unified-signatures */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface ObjectConstructor {
	/**
	 * Creates a hash table without any prototype and returns it
	 *
	 * @example
	 * ```js
	 * Object.createDict() // {__proto__: null}
	 * ```
	 */
	createDict<V = unknown>(): Dictionary<V>;

	/**
	 * Creates a hash table without any prototype and returns it
	 *
	 * @param objects - extension objects:
	 *   all keys from these objects are merged to the target
	 *
	 * @example
	 * ```js
	 * Object.createDict({a: 1}, {b: 2}) // {a: 1, b: 2, __proto__: null}
	 * ```
	 */
	createDict<D extends object>(...objects: Array<Nullable<D>>): Pick<D, keyof D>;

	/**
	 * Takes the enum-like object and converts it to a dictionary:
	 * number values from the object are skipped
	 *
	 * @param obj
	 */
	convertEnumToDict<D extends object>(obj: Nullable<D>): {[K in keyof D]: K};

	/**
	 * Creates an object which has the similar structure to the TS enum and returns it
	 *
	 * @param obj - base object: it can be a dictionary or an array
	 * @example
	 * ```js
	 * Object.createEnumLike({a: 1}) // {a: 1, 1: 'a', __proto__: null}
	 * ```
	 */
	createEnumLike<D extends object, K extends keyof D>(obj: Nullable<D>):
		D extends Array<infer E> ? Dictionary<E | number> : D & {[I: string]: K};

	/**
	 * @deprecated
	 * @see ObjectConstructor.createEnumLike
	 */
	createMap<D extends object, K extends keyof D>(obj: Nullable<D>):
		D extends Array<infer E> ? Dictionary<E | number> : D & {[I: string]: K};

	/**
	 * Creates an object from the specified array
	 *
	 * @param arr
	 * @param [opts] - additional options
	 *
	 * @example
	 * ```js
	 * // {foo: true, bar: true}
	 * Object.fromArray(['foo', 'bar']);
	 *
	 * // {foo: 0, bar: 1}
	 * Object.fromArray(['foo', 'bar'], {value: (val, i) => i});
	 * ```
	 */
	fromArray<T>(arr: Nullable<any[]>, opts?: ObjectFromArrayOptions<T>): Dictionary<T>;

	/**
	 * Returns a curried version of `Object.select`
	 * @param condition - regular expression to filter by keys
	 */
	select(condition: RegExp | ObjectPropertyFilter): <D extends object>(obj: Nullable<D>) => {[K in keyof D]?: D[K]};

	/**
	 * Returns a curried version of `Object.select`
	 * @param condition - whitelist of keys to filter
	 */
	select(condition: []): <D extends object>(obj: D) => D;

	/**
	 * Returns a curried version of `Object.select`
	 * @param condition - whitelist of keys to filter
	 */
	select<C extends string>(condition: C | [C]): <D extends object>(obj: Nullable<D>) => Pick<D, Extract<keyof D, C>>;

	/**
	 * Returns a curried version of `Object.select`
	 * @param condition - whitelist of keys to filter
	 */
	select<
		C1 extends string,
		C2 extends string
	>(condition: [C1, C2]): <D extends object>(obj: Nullable<D>) => Pick<D, Extract<keyof D, C1 | C2>>;

	/**
	 * Returns a curried version of `Object.select`
	 * @param condition - whitelist of keys to filter
	 */
	select<
		C1 extends string,
		C2 extends string,
		C3 extends string
	>(condition: [C1, C2, C3]): <D extends object>(obj: Nullable<D>) => Pick<D, Extract<keyof D, C1 | C2 | C3>>;

	/**
	 * Returns a curried version of `Object.select`
	 * @param condition - whitelist of keys to filter
	 */
	select<
		C1 extends string,
		C2 extends string,
		C3 extends string,
		C4 extends string
	>(condition: [C1, C2, C3, C4]): <D extends object>(obj: Nullable<D>) => Pick<D, Extract<keyof D, C1 | C2 | C3 | C4>>;

	/**
	 * Returns a curried version of `Object.select`
	 * @param condition - whitelist of keys to filter
	 */
	select<
		C1 extends string,
		C2 extends string,
		C3 extends string,
		C4 extends string,
		C5 extends string
		>(condition: [C1, C2, C3, C4, C5]): <D extends object>(obj: Nullable<D>) =>
		Pick<D, Extract<keyof D, C1 | C2 | C3 | C4 | C5>>;

	/**
	 * Returns a curried version of `Object.select`
	 * @param condition - whitelist of keys to filter
	 */
	select(condition: Iterable<any>): <D extends object>(obj: Nullable<D>) => {[K in keyof D]?: D[K]};

	/**
	 * Returns a curried version of `Object.select`
	 * @param condition - map of keys to filter
	 */
	select<C extends object>(condition: C): <D extends object>(obj: Nullable<D>) => Pick<D, Extract<keyof D, keyof C>>;

	/**
	 * Returns a new object based on the specified, but only with fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - regular expression to filter by keys
	 */
	select<D extends object>(obj: Nullable<D>, condition: RegExp | ObjectPropertyFilter): {[K in keyof D]?: D[K]};

	/**
	 * Returns a new object based on the specified, but only with fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	select<D extends object>(obj: Nullable<D>, condition: []): D;

	/**
	 * Returns a new object based on the specified, but only with fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	select<D extends object, C extends string>(obj: Nullable<D>, condition: C | [C]): Pick<D, Extract<keyof D, C>>;

	/**
	 * Returns a new object based on the specified, but only with fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	select<
		D extends object,
		C1 extends string,
		C2 extends string
	>(obj: Nullable<D>, condition: [C1, C2]): Pick<D, Extract<keyof D, C1 | C2>>;

	/**
	 * Returns a new object based on the specified, but only with fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	select<
		D extends object,
		C1 extends string,
		C2 extends string,
		C3 extends string
	>(obj: Nullable<D>, condition: [C1, C2, C3]): Pick<D, Extract<keyof D, C1 | C2 | C3>>;

	/**
	 * Returns a new object based on the specified, but only with fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	select<
		D extends object,
		C1 extends string,
		C2 extends string,
		C3 extends string,
		C4 extends string
	>(obj: Nullable<D>, condition: [C1, C2, C3, C4]): Pick<D, Extract<keyof D, C1 | C2 | C3 | C4>>;

	/**
	 * Returns a new object based on the specified, but only with fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	select<
		D extends object,
		C1 extends string,
		C2 extends string,
		C3 extends string,
		C4 extends string,
		C5 extends string,
	>(obj: Nullable<D>, condition: [C1, C2, C3, C4, C5]): Pick<D, Extract<keyof D, C1 | C2 | C3 | C4 | C5>>;

	/**
	 * Returns a new object based on the specified, but only with fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	select<D extends object>(obj: Nullable<D>, condition: Iterable<any>): {[K in keyof D]?: D[K]};

	/**
	 * Returns a new object based on the specified, but only with fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - map of keys to filter
	 */
	select<D extends object, C extends object>(obj: Nullable<D>, condition: C): Pick<D, Extract<keyof D, keyof C>>;

	/**
	 * Returns a curried version of `Object.reject`
	 * @param condition - regular expression to filter by keys
	 */
	reject(condition: RegExp | ObjectPropertyFilter): <D extends object>(obj: Nullable<D>) => {[K in keyof D]?: D[K]};

	/**
	 * Returns a curried version of `Object.reject`
	 * @param condition - whitelist of keys to filter
	 */
	reject<C>(condition: []): <D extends object>(obj: Nullable<D>) => D;

	/**
	 * Returns a curried version of `Object.reject`
	 * @param condition - whitelist of keys to filter
	 */
	reject<C extends string>(condition: C | [C]): <D extends object>(obj: Nullable<D>) => Omit<D, C>;

	/**
	 * Returns a curried version of `Object.reject`
	 * @param condition - whitelist of keys to filter
	 */
	reject<
		C1 extends string,
		C2 extends string
		>(condition: [C1, C2]): <D extends object>(obj: Nullable<D>) => Omit<D, C1 | C2>;

	/**
	 * Returns a curried version of `Object.reject`
	 * @param condition - whitelist of keys to filter
	 */
	reject<
		C1 extends string,
		C2 extends string,
		C3 extends string
		>(condition: [C1, C2, C3]): <D extends object>(obj: Nullable<D>) => Omit<D, C1 | C2 | C3>;

	/**
	 * Returns a curried version of `Object.reject`
	 * @param condition - whitelist of keys to filter
	 */
	reject<
		C1 extends string,
		C2 extends string,
		C3 extends string,
		C4 extends string
	>(condition: [C1, C2, C3, C4]): <D extends object>(obj: Nullable<D>) => Omit<D, C1 | C2 | C3 | C4>;

	/**
	 * Returns a curried version of `Object.reject`
	 * @param condition - whitelist of keys to filter
	 */
	reject<
		C1 extends string,
		C2 extends string,
		C3 extends string,
		C4 extends string,
		C5 extends string
	>(condition: [C1, C2, C3, C4, C5]): <D extends object>(obj: Nullable<D>) => Omit<D, C1 | C2 | C3 | C4 | C5>;

	/**
	 * Returns a curried version of `Object.reject`
	 * @param condition - whitelist of keys to filter
	 */
	reject(condition: Iterable<any>): <D extends object>(obj: Nullable<D>) => {[K in keyof D]?: D[K]};

	/**
	 * Returns a curried version of `Object.reject`
	 * @param condition - map of keys to filter
	 */
	reject<C extends object>(condition: C): <D extends object>(obj: Nullable<D>) => Omit<D, keyof C>;

	/**
	 * Returns a new object based on the specified, but without fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - regular expression to filter by keys
	 */
	reject<D extends object>(obj: Nullable<D>, condition: RegExp | ObjectPropertyFilter): {[K in keyof D]?: D[K]};

	/**
	 * Returns a new object based on the specified, but without fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	reject<D extends object>(obj: Nullable<D>, condition: []): D;

	/**
	 * Returns a new object based on the specified, but without fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	reject<D extends object, C extends string>(obj: Nullable<D>, condition: C | [C]): Omit<D, C>;

	/**
	 * Returns a new object based on the specified, but without fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	reject<
		D extends object,
		C1 extends string,
		C2 extends string
	>(obj: Nullable<D>, condition: [C1, C2]): Omit<D, C1 | C2>;

	/**
	 * Returns a new object based on the specified, but without fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	reject<
		D extends object,
		C1 extends string,
		C2 extends string,
		C3 extends string
	>(obj: Nullable<D>, condition: [C1, C2, C3]): Omit<D, C1 | C2 | C3>;

	/**
	 * Returns a new object based on the specified, but without fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	reject<
		D extends object,
		C1 extends string,
		C2 extends string,
		C3 extends string,
		C4 extends string
	>(obj: Nullable<D>, condition: [C1, C2, C3, C4]): Omit<D, C1 | C2 | C3 | C4>;

	/**
	 * Returns a new object based on the specified, but without fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	reject<
		D extends object,
		C1 extends string,
		C2 extends string,
		C3 extends string,
		C4 extends string,
		C5 extends string
	>(obj: Nullable<D>, condition: [C1, C2, C3, C4, C5]): Omit<D, C1 | C2 | C3 | C4 | C5>;

	/**
	 * Returns a new object based on the specified, but without fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	reject<D extends object>(obj: Nullable<D>, condition: Iterable<any>): {[K in keyof D]?: D[K]};

	/**
	 * Returns a new object based on the specified, but without fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - map of keys to filter
	 */
	reject<D extends object, C extends object>(obj: Nullable<D>, condition: C): Omit<D, keyof C>;
}

interface ObjectFromArrayOptions<T = boolean> {
	/**
	 * Function that returns a key value
	 *
	 * @param el - element value
	 * @param i - element index
	 */
	key?(el: unknown, i: number): PropertyKey;

	/**
	 * @deprecated
	 * @see [[ObjectFromArrayOptions.key]]
	 */
	keyConverter?(i: number, el: unknown): PropertyKey;

	/**
	 * Function that returns an element value
	 *
	 * @param el - element value
	 * @param i - element index
	 */
	value?(el: unknown, i: number): T;

	/**
	 * @deprecated
	 * @see [[ObjectFromArrayOptions.value]]
	 */
	valueConverter?(el: unknown, i: number): T;
}
