/* eslint-disable max-lines */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/prelude/README.md]]
 * @packageDocumentation
 */

declare namespace TB {
	type Cast<X, Y> = X extends Y ? X : Y;

	type Type<A extends any, ID extends string> = A & {
		[K in typeof symbol]: ID;
	};

	type Length<T extends any[]> = T['length'];

	type Head<T extends any[]> = T extends [any, ...any[]] ?
		T[0] : never;

	type Tail<T extends any[]> = ((...t: T) => any) extends ((_: any, ...tail: infer TT) => any) ?
		TT : [];

	type HasTail<T extends any[]> = T extends [any] | [] ? false : true;

	type Last<T extends any[]> = {
		0: Last<Tail<T>>;
		1: Head<T>;
	}[HasTail<T> extends true ? 0 : 1];

	type Prepend<E, T extends any[]> =
		((head: E, ...args: T) => any) extends ((...args: infer U) => any) ? U : T;

	type Drop<N extends number, T extends any[], I extends any[] = []> = {
		0: Drop<N, Tail<T>, Prepend<any, I>>;
		1: T;
	}[Length<I> extends N ? 1 : 0];

	type Pos<I extends any[]> = Length<I>;
	type Next<I extends any[]> = Prepend<any, I>;
	type Prev<I extends any[]> = Tail<I>;

	type Reverse<T extends any[], R extends any[] = [], I extends any[] = []> = {
		0: Reverse<T, Prepend<T[Pos<I>], R>, Next<I>>;
		1: R;
	}[Pos<I> extends Length<T> ? 1 : 0];

	type Concat<T1 extends any[], T2 extends any[]> = Reverse<Cast<Reverse<T1>, any[]>, T2>;

	type Append<E, T extends any[]> = Concat<T, [E]>;

	type __ = Type<{}, 'x'>;

	type GapOf<T1 extends any[], T2 extends any[], TN extends any[], I extends any[]> =
		T1[Pos<I>] extends __ ? Append<T2[Pos<I>], TN> : TN;

	type GapsOf<T1 extends any[], T2 extends any[], TN extends any[] = [], I extends any[] = []> = {
		0: GapsOf<T1, T2, Cast<GapOf<T1, T2, TN, I>, any[]>, Next<I>>;
		1: Concat<TN, Cast<Drop<Pos<I>, T2>, any[]>>;
	}[Pos<I> extends Length<T1> ? 1 : 0];

	type PartialGaps<T extends any[]> = {
		[K in keyof T]?: T[K] | __;
	};

	type CleanedGaps<T extends any[]> = {
		[K in keyof T]: NonNullable<T[K]>;
	};

	type Gaps<T extends any[]> = CleanedGaps<PartialGaps<T>>;

	type Curry<F extends ((...args: any) => any)> =
		<T extends any[]>(...args: Cast<Cast<T, Gaps<Parameters<F>>>, any[]>) =>
			GapsOf<T, Parameters<F>> extends [any, ...any[]] ?
				Curry<(...args: Cast<GapsOf<T, Parameters<F>>, any[]>) => ReturnType<F>> :
				ReturnType<F>;
}

declare const DEBUG: boolean;
declare const IS_PROD: boolean;

declare const APP_NAME: string;
declare const API_URL: CanUndef<string>;
declare const LOCALE: string;

/**
 * Converts the specified unknown value to any
 * @param obj
 */
declare function Any(obj: unknown): any;

/**
 * STDERR wrapper
 * @param err
 */
declare function stderr(err: unknown): void;

/**
 * Global i18n function (can be used as a string tag or simple function)
 */
declare function i18n(strings: unknown | string[], ...expr: unknown[]): string;

/**
 * @alias
 * @see globalI18n
 */
declare function t(strings: unknown | string[], ...expr: unknown[]): string;

/**
 * Global i18n loopback (can be used as a string tag or simple function)
 */
declare function l(strings: unknown | string[], ...expr: unknown[]): string;

declare class IdleDeadline {
	readonly didTimeout: boolean;
	timeRemaining(): number;
}

declare function requestIdleCallback(fn: (deadline: IdleDeadline) => void, opts?: {timer?: number}): number;
declare function cancelIdleCallback(id: number): void;

declare function setImmediate(fn: AnyFunction): number;
declare function clearImmediate(id: number): void;

type CanPromise<T> = T | Promise<T>;
type CanArray<T> = T | T[];

type CanUndef<T> = T | undefined;
type Nullable<T> = T | null | undefined;

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
type CanVoid<T> = T | void;

interface AnyFunction<ARGS = any[], R = any> extends Function {
	(...args: ARGS): R;
}

interface AnyOneArgFunction<ARG = any, R = any> extends Function {
	(arg: ARG): R;
}

interface ClassConstructor<T = unknown> {
	new: T;
}

interface StrictDictionary<T = unknown> {
	[key: string | symbol]: T;
}

interface Dictionary<T> {
	[key: string | symbol]: CanUndef<T>;
}

interface Dictionary<T extends unknown = unknown> {
	[key: string | symbol]: T;
}

interface Maybe<T = unknown> extends Promise<T> {
	readonly type: 'Maybe';
}

interface Either<T = unknown> extends Promise<T> {
	readonly type: 'Either';
}

type NewPromise<K, V> = K extends Maybe ?
	Maybe<V> : K extends Either ?
		Either<V> : Promise<V>;

type PromiseType<T extends Promise<any>> =
	T extends Maybe<infer V> ?
		NonNullable<V> : T extends Promise<infer V> ? V : T;

type DictionaryType<T extends Dictionary> = T extends Dictionary<infer V> ? NonNullable<V> : T;
type IterableType<T extends Iterable<unknown>> = T extends Iterable<infer V> ? V : T;

interface ArrayLike<T = unknown> {
	[i: number]: T;
	length: number;
}

interface JSONCb {
	(key: string, value: unknown): unknown;
}

interface FastCloneOptions {
	/**
	 * JSON.stringify replacer
	 */
	replacer?: JSONCb;

	/**
	 * Reviver function for JSON.parse or false to disable defaults
	 */
	reviver?: JSONCb | false;

	/**
	 * If false the object freeze state won't be copy
	 * @default `true`
	 */
	freezable?: boolean;
}

interface ObjectMixinOptions<V = unknown, K = unknown, D = unknown> {
	/**
	 * If true, then object properties are copied recursively
	 *
	 * @default `false`
	 * @example
	 * ```js
	 * // {a: {c: 2}}
	 * Object.mixin({deep: false}, {a: {b: 1}}, {a: {c: 2}});
	 *
	 * // {a: {b: 1, c: 2}}
	 * Object.mixin({deep: true}, {a: {b: 1}}, {a: {c: 2}});
	 * ```
	 */
	deep?: boolean;

	/**
	 * If true, then only new object properties are copied, or if `-1`, only old
	 *
	 * @default `false`
	 * @example
	 * ```js
	 * // {a: 1, b: 3}
	 * Object.mixin({onlyNew: true}, {a: 1}, {a: 2, b: 3});
	 *
	 * // {a: 2}
	 * Object.mixin({onlyNew: -1}, {a: 1}, {a: 2, b: 3});
	 * ```
	 */
	onlyNew?: boolean | -1;

	/**
	 * @deprecated
	 * @see [[ObjectMixinOptions.onlyNew]]
	 */
	traits?: boolean | -1;

	/**
	 * If true, then the original value of an object property can be rewritten from another object with undefined value
	 *
	 * @default `false`
	 * @example
	 * ```js
	 * // {a: 1}
	 * Object.mixin({withUndef: false}, {a: 1}, {a: undefined});
	 *
	 * // {a: undefined}
	 * Object.mixin({withUndef: true}, {a: 1}, {a: undefined});
	 * ```
	 */
	withUndef?: boolean;

	/**
	 * If true, then an object property descriptor is copied too
	 * @default `false`
	 */
	withDescriptor?: boolean;

	/**
	 * If true, then accessors (but not the whole descriptor) of an object property are copied too
	 * @default `false`
	 */
	withAccessors?: boolean;

	/**
	 * If true, then object properties are copied with their prototypes
	 * (works only with the "deep" mode)
	 *
	 * @default `false`
	 * @example
	 * ```js
	 * const proto = {
	 *   a: {
	 *     b: 2
	 *   },
	 *
	 *   c: 3
	 * };
	 *
	 * const obj = Object.create(proto);
	 * Object.mixin({deep: true, withProto: false}, obj, {c: 2, a: {d: 4}});
	 *
	 * // 2
	 * // 4
	 * // 2
	 * // true
	 * // true
	 * console.log(
	 *   obj.c,
	 *   obj.a.d,
	 *   obj.a.b,
	 *   obj.a.hasOwnProperty('d'),
	 *   obj.a.hasOwnProperty('b')
	 * );
	 *
	 * const obj2 = Object.create(proto);
	 * Object.mixin({deep: true, withProto: true}, obj2, {c: 2, a: {d: 4}});
	 *
	 * // 2
	 * // 4
	 * // 2
	 * // true
	 * // false
	 * console.log(
	 *   obj2.c,
	 *   obj2.a.d,
	 *   obj2.a.b,
	 *   obj2.a.hasOwnProperty('d'),
	 *   obj2.a.hasOwnProperty('b')
	 * );
	 * ```
	 */
	withProto?: boolean;

	/**
	 * If true, then to merge two arrays will be used a concatenation strategy
	 * (works only with the "deep" mode)
	 *
	 * @default `false`
	 * @example
	 * ```js
	 * // {a: [2]}
	 * Object.mixin({deep: true, concatArray: false}, {a: [1]}, {a: [2]});
	 *
	 * // {a: [1, 2]}
	 * Object.mixin({deep: true, concatArray: true}, {a: [1]}, {a: [2]});
	 * ```
	 */
	concatArray?: boolean;

	/**
	 * Function that concatenates arrays
	 * (works only with the "concatArray" mode)
	 *
	 * @param oldValue - old array
	 * @param newValue - new array
	 * @param key - target property key
	 * @default `Array.prototype.concat`
	 *
	 * @example
	 * ```js
	 * // {a: [1, 1, 2]}
	 * Object.mixin({deep: true, concatArray: true}, {a: [1]}, {a: [1, 2]});
	 *
	 * // {a: [1, 2]}
	 * Object.mixin({deep: true, concatArray: true, concatFn: [].union}, {a: [1]}, {a: [1, 2]});
	 * ```
	 */
	concatFn?(oldValue: V, newValue: unknown[], key: K): unknown[];

	/**
	 * Function that filters values for deep extending
	 * (works only with the "deep" mode)
	 *
	 * @param target - target object
	 * @param value - new value to set
	 * @param key - target property key
	 *
	 * @example
	 * ```js
	 * // {a: {a: 1, b: 2}}
	 * Object.mixin({deep: true}, {a: {a: 1}}, {a: {b: 2}});
	 *
	 * // {a: {b: 2}}
	 * Object.mixin({deep: true, extendFilter: (t, v) => !v.b}, {a: {a: 1}}, {a: {b: 2}});
	 * ```
	 */
	extendFilter?(target: V, value: unknown, key: K): unknown;

	/**
	 * Function that filters values which shouldn't be copied
	 *
	 * @param el - element value
	 * @param key - element key
	 * @param data - element container
	 * @default `false`
	 *
	 * @example
	 * ```js
	 * // {a: 1, b: 2}
	 * Object.mixin({deep: true}, {a: 1}, {b: 2});
	 *
	 * // {a: 1}
	 * Object.mixin({deep: true, filter: (el, key) => key !== 'b'}, {a: 1}, {b: 2});
	 * ```
	 */
	filter?(el: V, key: K, data: D): unknown;
}

interface ObjectGetOptions {
	/**
	 * Character to declare the path
	 *
	 * @example
	 * ```js
	 * Object.get({a: {b: 1}}, 'a:b', {separator: ':'})
	 * ```
	 */
	separator?: string;
}

interface ObjectSetOptions extends ObjectGetOptions {
	/**
	 * If true, then a new value will be concatenated with the old
	 *
	 * @example
	 * ```js
	 * const obj = {a: {b: 1}};
	 * Object.set(obj, 'a.b', 2, {concat: true})
	 * console.log(obj); // [1, 2]
	 * ```
	 */
	concat?: boolean;
}

interface ObjectForEachOptions {
	/**
	 * If true, then the first element of the callback function will be an element descriptor
	 *
	 * @example
	 * ```js
	 * Object.forEach({a: 1}, {withDescriptor: true}, (el) => {
	 *   console.log(el); // {configurable: true, enumerable: true, writable: true, value: 1}
	 * });
	 * ```
	 */
	withDescriptor?: boolean;

	/**
	 * Strategy for not own properties of the iterated object:
	 *   1. if `false`, then the `hasOwnProperty` test is enabled and all not own properties will be skipped;
	 *   1. if `true`, then the `hasOwnProperty` test is disabled;
	 *   1. if `-1`, then the `hasOwnProperty` test is enabled and all own properties will be skipped.
	 *
	 * @example
	 * ```js
	 * const obj = {a: 1, __proto__: {b: 2}};
	 *
	 * Object.forEach(obj, (el) => {
	 *   console.log(el); // 1
	 * });
	 *
	 * Object.forEach(obj, {notOwn: true}, (el) => {
	 *   console.log(el); // 1 2
	 * });
	 *
	 * Object.forEach(obj, {notOwn: -1}, (el) => {
	 *   console.log(el); // 2
	 * });
	 * ```
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

interface ObjectFromArrayOptions<T = boolean> {
	/**
	 * Function that returns a key value
	 *
	 * @param el - element value
	 * @param i - element index
	 */
	key?(el: unknown, i: number): string | symbol;

	/**
	 * @deprecated
	 * @see [[ObjectFromArrayOptions.key]]
	 *
	 * @param i
	 * @param el
	 */
	keyConverter?(i: number, el: unknown): string | symbol;

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
	 *
	 * @param el
	 * @param i
	 */
	valueConverter?(el: unknown, i: number): T;
}

type ObjectPropertyPath =
	string |
	unknown[];

interface ObjectConstructor {
	/**
	 * Returns a value from the passed object by the specified path
	 *
	 * @param obj
	 * @param path
	 * @param [opts] - additional options
	 */
	get<T = unknown>(obj: unknown, path: ObjectPropertyPath, opts?: ObjectGetOptions): T;

	/**
	 * Returns a function that returns a value from the passed object, which the function takes, by the specified path
	 *
	 * @param path
	 * @param [opts] - additional options
	 */
	get<T = unknown>(path: ObjectPropertyPath, opts?: ObjectGetOptions): (obj: unknown) => T;

	/**
	 * Returns a function that returns a value from the specified object by a path that the function takes
	 *
	 * @param obj
	 * @param [opts] - additional options
	 */
	get<T = unknown>(obj: unknown, opts?: ObjectGetOptions): (path: ObjectPropertyPath) => T;

	/**
	 * Returns true if an object has a property by the specified path
	 *
	 * @param obj
	 * @param path
	 * @param [opts] - additional options
	 */
	has(obj: object, path: ObjectPropertyPath, opts?: ObjectGetOptions): boolean;

	/**
	 * Returns a function that returns true if an object, which the function takes, has a value by the specified path
	 *
	 * @param path
	 * @param [opts] - additional options
	 */
	has(path: ObjectPropertyPath, opts?: ObjectGetOptions): (obj: unknown) => boolean;

	/**
	 * Returns a function that returns true if the specified object has a value by a path that the function takes
	 *
	 * @param obj
	 * @param [opts] - additional options
	 */
	has(obj: object, opts?: ObjectGetOptions): (path: ObjectPropertyPath) => boolean;

	/**
	 * Returns a function that returns true if the passed object, which the function takes,
	 * has own property by the specified key
	 *
	 * @param key
	 */
	hasOwnProperty(key: string): (obj: unknown) => boolean;

	/**
	 * Returns a function that returns true if the specified object has own property by a key the the function takes
	 * @param obj
	 */
	hasOwnProperty(obj: unknown): (key: string) => boolean;

	/**
	 * Returns true if the passed object has an own property by the specified key
	 *
	 * @param obj
	 * @param key
	 */
	hasOwnProperty(obj: unknown, key: string): boolean;

	/**
	 * Sets a value to the passed object by the specified path.
	 * The final function returns a value that was added.
	 *
	 * @param obj
	 * @param path
	 * @param value
	 * @param [opts] - additional options
	 */
	set<T>(obj: unknown, path: ObjectPropertyPath, value: T, opts?: ObjectSetOptions): T;

	/**
	 * Returns a function that sets a value to an object, which the function takes, by the specified path.
	 * The final function returns a link to the object.
	 *
	 * @param path
	 * @param [opts] - additional options
	 * @param [value]
	 */
	set(path: ObjectPropertyPath, opts?: ObjectSetOptions, value?: unknown): <T>(obj: T, value?: unknown) => T;

	/**
	 * Returns a function that sets a value to the specified object by a path that the function takes.
	 * The final function returns a link to the object.
	 *
	 * @param obj
	 * @param [opts] - additional options
	 * @param [value]
	 */
	set<T>(obj: T, opts?: ObjectSetOptions, value?: unknown): (path: ObjectPropertyPath, value?: unknown) => T;

	/**
	 * Returns length of the specified object
	 * @param obj
	 */
	size(obj: unknown): number;

	/**
	 * Iterates over the specified dictionary
	 *
	 * @param obj - object to iterate
	 * @param opts - additional options
	 * @param cb - callback function that is called on each of object elements
	 */
	forEach<V>(
		obj: Dictionary<V>,
		opts: ObjectForEachOptions & {withDescriptor: true},
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
		opts: ObjectForEachOptions & ({notOwn: boolean | -1} | {withDescriptor: false}),
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
	forEach<V = unknown, K = unknown, D = unknown>(
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
	forEach<V = unknown, K = unknown, D = unknown>(
		obj: D,
		cb: (el: V, key: K, data: D) => any,
		opts?: ObjectForEachOptions
	): void;

	/**
	 * Returns a curried version of Object.fastCompare for one argument
	 * @param a
	 */
	fastCompare(a: unknown): <T>(b: T) => a is T;

	/**
	 * Compares two specified objects by using a naive but fast "JSON.stringify/parse" strategy and
	 * returns true if their are equal
	 *
	 * @param a
	 * @param b
	 */
	fastCompare<T>(a: unknown, b: T): a is T;

	/**
	 * Returns a curried version of Object.fastClone
	 *
	 * @param obj
	 * @param opts - additional options
	 */
	fastClone(obj: undefined, opts: FastCloneOptions): <T>(obj: T) => T;

	/**
	 * Clones the specified object by using a naive but fast "JSON.stringify/parse" strategy and returns a new object.
	 *
	 * Mind, that this method uses non-stable version JSON.stringify, i.e.,
	 * it can work incorrectly with object like {a: 1, b: 2} and {b: 2, a: 1}.
	 *
	 * @param obj
	 * @param [opts] - additional options
	 */
	fastClone<T>(obj: T, opts?: FastCloneOptions): T;

	/**
	 * Returns a string representation of the specified object by using a naive but fast "JSON.stringify/parse" strategy.
	 *
	 * Mind, that this method uses non-stable version JSON.stringify, i.e.,
	 * it can work incorrectly with object like {a: 1, b: 2} and {b: 2, a: 1}.
	 *
	 * @param obj
	 */
	fastHash(obj: unknown): string;

	/**
	 * Returns a curried version of Object.mixin for one argument
	 * @param opts - if true, then properties will be copied recursively, or additional options to extend
	 */
	mixin(opts: ObjectMixinOptions | boolean): <B, O1>(base: B, obj1: O1) => B & O1;

	/**
	 * Returns a curried version of Object.mixin for one argument
	 * @param opts - if true, then properties will be copied recursively, or additional options to extend
	 */
	mixin(opts: ObjectMixinOptions | boolean): <R = unknown>(...objects: unknown[]) => R;

	/**
	 * Returns a curried version of Object.mixin for two arguments
	 *
	 * @param opts - if true, then properties will be copied recursively, or additional options to extend
	 * @param base - base object
	 */
	mixin<B>(opts: ObjectMixinOptions | boolean, base: B): <O1>(obj1: O1) => B & O1;

	/**
	 * Returns a curried version of Object.mixin for two arguments
	 *
	 * @param opts - if true, then properties will be copied recursively, or additional options to extend
	 * @param base - base object
	 */
	mixin(opts: ObjectMixinOptions | boolean, base: unknown): <R = unknown>(...objects: unknown[]) => R;

	/**
	 * Extends the specified object by another objects.
	 * If the base value is not an object, a new object will be created with a type similar to the first extension object.
	 *
	 * @param opts - if true, then properties will be copied recursively, or additional options to extend
	 * @param base - base object
	 * @param obj1 - object for extending
	 */
	mixin<B, O1>(opts: ObjectMixinOptions | boolean, base?: B, obj1: O1): B & O1;

	/**
	 * Extends the specified object by another objects.
	 * If the base value is not an object, a new object will be created with a type similar to the first extension object.
	 *
	 * @param opts - if true, then properties will be copied recursively, or additional options to extend
	 * @param base - base object
	 * @param obj1 - object for extending
	 * @param obj2 - object for extending
	 */
	mixin<B, O1, O2>(opts: ObjectMixinOptions | boolean, base?: B, obj1: O1, obj2: O2): B & O1 & O2;

	/**
	 * Extends the specified object by another objects.
	 * If the base value is not an object, a new object will be created with a type similar to the first extension object.
	 *
	 * @param opts - if true, then properties will be copied recursively, or additional options to extend
	 * @param base - base object
	 * @param obj1 - object for extending
	 * @param obj2 - object for extending
	 * @param obj3 - object for extending
	 */
	mixin<B, O1, O2, O3>(opts: ObjectMixinOptions | boolean, base?: B, obj1: O1, obj2: O2, obj3: O3): B & O1 & O2 & O3;

	/**
	 * Extends the specified object by another objects.
	 * If the base value is not an object, a new object will be created with a type similar to the first extension object.
	 *
	 * @param opts - if true, then properties will be copied recursively, or additional options to extend
	 * @param base - base object
	 * @param objects - objects for extending
	 */
	mixin<R = unknown>(opts: ObjectMixinOptions | boolean, base?: unknown, ...objects: unknown[]): R;

	/**
	 * Returns a curried version of Object.parse
	 * @param reviver - reviver function for JSON.parse
	 */
	parse(reviver?: JSONCb): <V, R = unknown>(value: V) => V extends string ? R : V;

	/**
	 * Parses the specified value as a JSON/JS object and returns the result of parsing.
	 * If the value isn't a string or can't be parsed, the function returns the original value.
	 *
	 * @param value
	 * @param [reviver] - reviver function for JSON.parse
	 */
	parse<V, R = unknown>(value: V, reviver?: JSONCb): V extends string ? R : V;

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
	createDict<D extends object>(...objects: D[]): Pick<D, keyof D>;

	/**
	 * Takes the enum-like object and converts it to a dictionary:
	 * number values from the object are skipped
	 *
	 * @param obj
	 */
	convertEnumToDict<D extends object>(obj: D): {[K in keyof D]: K};

	/**
	 * Creates an object which has the similar structure to the TS enum and returns it
	 *
	 * @param obj - base object: it can be a dictionary or an array
	 * @example
	 * ```js
	 * Object.createEnumLike({a: 1}) // {a: 1, 1: 'a', __proto__: null}
	 * ```
	 */
	createEnumLike<D extends object, K extends keyof D>(obj: D):
		D extends Array<infer E> ? Dictionary<E | number> : D & {[I: string]: K};

	/**
	 * @deprecated
	 * @see ObjectConstructor.createEnumLike
	 */
	createMap<D extends object, K extends keyof D>(obj: D):
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
	fromArray<T>(arr: unknown[], opts?: ObjectFromArrayOptions<T>): Dictionary<T>;

	/**
	 * Returns a curried version of Object.select
	 * @param condition - regular expression to filter
	 */
	select(condition: RegExp): <D extends object>(obj: D) => {[K in keyof D]?: D[K]};

	/**
	 * Returns a curried version of Object.select
	 * @param condition - whitelist of keys to filter
	 */
	select(condition: []): <D extends object>(obj: D) => D;

	/**
	 * Returns a curried version of Object.select
	 * @param condition - whitelist of keys to filter
	 */
	select<C extends string>(condition: C | [C]): <D extends object>(obj: D) => Pick<D, Extract<keyof D, C>>;

	/**
	 * Returns a curried version of Object.select
	 * @param condition - whitelist of keys to filter
	 */
	select<
		C1 extends string,
		C2 extends string
	>(condition: [C1, C2]): <D extends object>(obj: D) => Pick<D, Extract<keyof D, C1 | C2>>;

	/**
	 * Returns a curried version of Object.select
	 * @param condition - whitelist of keys to filter
	 */
	select<
		C1 extends string,
		C2 extends string,
		C3 extends string,
	>(condition: [C1, C2, C3]): <D extends object>(obj: D) => Pick<D, Extract<keyof D, C1 | C2 | C3>>;

	/**
	 * Returns a curried version of Object.select
	 * @param condition - whitelist of keys to filter
	 */
	select<
		C1 extends string,
		C2 extends string,
		C3 extends string,
		C4 extends string
	>(condition: [C1, C2, C3, C4]): <D extends object>(obj: D) => Pick<D, Extract<keyof D, C1 | C2 | C3 | C4>>;

	/**
	 * Returns a curried version of Object.select
	 * @param condition - whitelist of keys to filter
	 */
	select<
		C1 extends string,
		C2 extends string,
		C3 extends string,
		C4 extends string,
		C5 extends string
	>(condition: [C1, C2, C3, C4, C5]): <D extends object>(obj: D) => Pick<D, Extract<keyof D, C1 | C2 | C3 | C4 | C5>>;

	/**
	 * Returns a curried version of Object.select
	 * @param condition - whitelist of keys to filter
	 */
	select<C extends string>(condition: Iterable<C>): <D extends object>(obj: D) => {[K in keyof D]?: D[K]};

	/**
	 * Returns a curried version of Object.select
	 * @param condition - map of keys to filter
	 */
	select<C extends object>(condition: C): <D extends object>(obj: D) => Pick<D, Extract<keyof D, keyof C>>;

	/**
	 * Returns a new object based on the specified, but only with fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - regular expression to filter
	 */
	select<D extends object>(obj: D, condition: RegExp): {[K in keyof D]?: D[K]};

	/**
	 * Returns a new object based on the specified, but only with fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	select<D extends object>(obj: D, condition: []): D;

	/**
	 * Returns a new object based on the specified, but only with fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	select<D extends object, C extends string>(obj: D, condition: C | [C]): Pick<D, Extract<keyof D, C>>;

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
	>(obj: D, condition: [C1, C2]): Pick<D, Extract<keyof D, C1 | C2>>;

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
	>(obj: D, condition: [C1, C2, C3]): Pick<D, Extract<keyof D, C1 | C2 | C3>>;

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
	>(obj: D, condition: [C1, C2, C3, C4]): Pick<D, Extract<keyof D, C1 | C2 | C3 | C4>>;

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
	>(obj: D, condition: [C1, C2, C3, C4, C5]): Pick<D, Extract<keyof D, C1 | C2 | C3 | C4 | C5>>;

	/**
	 * Returns a new object based on the specified, but only with fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	select<D extends object, C extends string>(obj: D, condition: Iterable<C>): {[K in keyof D]?: D[K]};

	/**
	 * Returns a new object based on the specified, but only with fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - map of keys to filter
	 */
	select<D extends object, C extends object>(obj: D, condition: C): Pick<D, Extract<keyof D, keyof C>>;

	/**
	 * Returns a curried version of Object.reject
	 * @param condition - regular expression to filter
	 */
	reject(condition: RegExp): <D extends object>(obj: D) => {[K in keyof D]?: D[K]};

	/**
	 * Returns a curried version of Object.reject
	 * @param condition - whitelist of keys to filter
	 */
	reject<C>(condition: []): <D extends object>(obj: D) => D;

	/**
	 * Returns a curried version of Object.reject
	 * @param condition - whitelist of keys to filter
	 */
	reject<C extends string>(condition: C | [C]): <D extends object>(obj: D) => Omit<D, C>;

	/**
	 * Returns a curried version of Object.reject
	 * @param condition - whitelist of keys to filter
	 */
	reject<
		C1 extends string,
		C2 extends string
	>(condition: [C1, C2]): <D extends object>(obj: D) => Omit<D, C1 | C2>;

	/**
	 * Returns a curried version of Object.reject
	 * @param condition - whitelist of keys to filter
	 */
	reject<
		C1 extends string,
		C2 extends string,
		C3 extends string
	>(condition: [C1, C2, C3]): <D extends object>(obj: D) => Omit<D, C1 | C2 | C3>;

	/**
	 * Returns a curried version of Object.reject
	 * @param condition - whitelist of keys to filter
	 */
	reject<
		C1 extends string,
		C2 extends string,
		C3 extends string,
		C4 extends string
	>(condition: [C1, C2, C3, C4]): <D extends object>(obj: D) => Omit<D, C1 | C2 | C3 | C4>;

	/**
	 * Returns a curried version of Object.reject
	 * @param condition - whitelist of keys to filter
	 */
	reject<
		C1 extends string,
		C2 extends string,
		C3 extends string,
		C4 extends string,
		C5 extends string
	>(condition: [C1, C2, C3, C4, C5]): <D extends object>(obj: D) => Omit<D, C1 | C2 | C3 | C4 | C5>;

	/**
	 * Returns a curried version of Object.reject
	 * @param condition - whitelist of keys to filter
	 */
	reject<C extends string>(condition: Iterable<C>): <D extends object>(obj: D) => {[K in keyof D]?: D[K]};

	/**
	 * Returns a curried version of Object.reject
	 * @param condition - map of keys to filter
	 */
	reject<C extends object>(condition: C): <D extends object>(obj: D) => Omit<D, keyof C>;

	/**
	 * Returns a new object based on the specified, but without fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - regular expression to filter
	 */
	reject<D extends object>(obj: D, condition: RegExp): {[K in keyof D]?: D[K]};

	/**
	 * Returns a new object based on the specified, but without fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	reject<D extends object>(obj: D, condition: []): D;

	/**
	 * Returns a new object based on the specified, but without fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	reject<D extends object, C extends string>(obj: D, condition: C | [C]): Omit<D, C>;

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
	>(obj: D, condition: [C1, C2]): Omit<D, C1 | C2>;

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
	>(obj: D, condition: [C1, C2, C3]): Omit<D, C1 | C2 | C3>;

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
	>(obj: D, condition: [C1, C2, C3, C4]): Omit<D, C1 | C2 | C3 | C4>;

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
	>(obj: D, condition: [C1, C2, C3, C4, C5]): Omit<D, C1 | C2 | C3 | C4 | C5>;

	/**
	 * Returns a new object based on the specified, but without fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys to filter
	 */
	reject<D extends object, C extends string>(obj: D, condition: Iterable<C>): {[K in keyof D]?: D[K]};

	/**
	 * Returns a new object based on the specified, but without fields that match to the specified condition
	 *
	 * @param obj
	 * @param condition - map of keys to filter
	 */
	reject<D extends object, C extends object>(obj: D, condition: C): Omit<D, keyof C>;

	/**
	 * Wraps the specified value into the Either structure.
	 * If the value is equal to null or undefined, the value is rejected.
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * Object.Option(toLowerCase)(null).catch((err) => err === null);
	 * Object.Option(null).catch((err) => err === null);
	 *
	 * Object.Option(toLowerCase)('FOO').then((value) => value === 'foo');
	 * Object.Option('foo').then((value) => value === 'foo');
	 * ```
	 */
	Option<R>(value: () => R): AnyFunction<any[], Maybe<R>>;

	/**
	 * Wraps the specified value into the Either structure.
	 * If the value is equal to null or undefined, the value is rejected.
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * Object.Option(toLowerCase)(null).catch((err) => err === null);
	 * Object.Option(null).catch((err) => err === null);
	 *
	 * Object.Option(toLowerCase)('FOO').then((value) => value === 'foo');
	 * Object.Option('foo').then((value) => value === 'foo');
	 * ```
	 */
	Option<A1, A extends unknown[], R>(value: (a1: A1, a: A) => R):
		AnyFunction<[Maybe<Nullable<A1>> | Either<A1> | Nullable<A1>, ...A], Maybe<R>>;

	/**
	 * Wraps the specified value into the Either structure.
	 * If the value is equal to null or undefined, the value is rejected.
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * Object.Option(toLowerCase)(null).catch((err) => err === null);
	 * Object.Option(null).catch((err) => err === null);
	 *
	 * Object.Option(toLowerCase)('FOO').then((value) => value === 'foo');
	 * Object.Option('foo').then((value) => value === 'foo');
	 * ```
	 */
	Option<T = unknown>(value: T): Maybe<T>;

	/**
	 * Wraps the specified value into the Either structure
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * Object.Result(toLowerCase)(null).catch((err) => err.message === 'str is null');
	 * Object.Result(Object.result(toLowerCase)(null)).catch((err) => err.message === 'str is null');
	 *
	 * Object.Result(toLowerCase)('FOO').then((value) => value === 'foo');
	 * Object.Result('foo').then((value) => value === 'foo');
	 * ```
	 */
	Result<R>(value: () => R): AnyFunction<any[], Either<R>>;

	/**
	 * Wraps the specified value into the Either structure
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * Object.Result(toLowerCase)(null).catch((err) => err.message === 'str is null');
	 * Object.Result(Object.result(toLowerCase)(null)).catch((err) => err.message === 'str is null');
	 *
	 * Object.Result(toLowerCase)('FOO').then((value) => value === 'foo');
	 * Object.Result('foo').then((value) => value === 'foo');
	 * ```
	 */
	Result<A1, A extends unknown[], R>(value: (a1: A1, a: A) => R):
		AnyFunction<[Maybe<A1> | Either<A1> | Nullable<A1>, ...A], Either<R>>;

	/**
	 * Wraps the specified value into the Either structure
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * Object.Result(toLowerCase)(null).catch((err) => err.message === 'str is null');
	 * Object.Result(Object.result(toLowerCase)(null)).catch((err) => err.message === 'str is null');
	 *
	 * Object.Result(toLowerCase)('FOO').then((value) => value === 'foo');
	 * Object.Result('foo').then((value) => value === 'foo');
	 * ```
	 */
	Result<T = unknown>(value: T): Either<T>;

	/**
	 * Returns true if the specified value is a plain object
	 * @param obj
	 */
	isPlainObject<T>(obj: T): obj is
		T extends
			unknown[] |

			Int8Array |
			Int16Array |
			Int32Array |

			Uint8Array |
			Uint8ClampedArray |
			Uint16Array |
			Uint32Array |

			Float32Array |
			Float64Array |

			ArrayBuffer |
			SharedArrayBuffer |
			DataView |
			FormData |

			Date |
			RegExp |
			Map<any, any> |
			WeakMap<any, any> |
			Set<any> |
			WeakSet<any> |
			Promise<any> |

			Generator |
			AnyFunction |

			/* eslint-disable @typescript-eslint/ban-types */

			Number |
			String |
			Symbol |
			Boolean |

			/* eslint-enable @typescript-eslint/ban-types */

			Node |
			Document |
			Window |
			Navigator |
			Error |

			Intl.Collator |
			Intl.DateTimeFormat |
			Intl.NumberFormat

		? Dictionary : T extends object ? NonNullable<T> : Dictionary;

	/**
	 * Returns true if the specified value is a dictionary.
	 * This method is similar to "isPlainObject", but it has another output TS type:
	 * instead of inferring of an output type the method always cast the type to a dictionary.
	 *
	 * @param value
	 *
	 * @example
	 * ```typescript
	 * interface Foo {
	 *   bar(): number;
	 * }
	 *
	 * function foo(val: number | Foo) {
	 *   if (Object.isPlainObject(val)) {
	 *     val.bar(); // All fine
	 *   }
	 *
	 *   if (Object.isDictionary(val)) {
	 *     val.bar(); // Warning: object is of type unknown
	 *   }
	 * }
	 * ```
	 */
	isDictionary(value: unknown): value is Dictionary;

	/**
	 * @deprecated
	 * @see [[ObjectConstructor.isPlainObject]]
	 * @see [[ObjectConstructor.isDictionary]]
	 */
	isObject(value: unknown): value is Dictionary;

	/**
	 * Returns true if the specified value has a primitive type
	 * @param value
	 */
	isPrimitive(value: unknown): boolean;

	/**
	 * Returns true if the specified value is a custom (not native) object or function
	 * @param value
	 */
	isCustomObject(value: unknown): boolean;

	/**
	 * Returns true if the specified value is a simple object (without a string type tag)
	 * @param value
	 */
	isSimpleObject<T extends object = object>(value: unknown): value is T;

	/**
	 * Returns true if the specified value is an array
	 * @param value
	 */
	isArray(value: unknown): value is unknown[];

	/**
	 * Returns true if the specified value is looks like an array
	 * @param value
	 */
	isArrayLike(value: unknown): value is ArrayLike;

	/**
	 * Returns true if the specified value is a function
	 * @param value
	 */
	isFunction(value: unknown): value is AnyFunction;

	/**
	 * Returns true if the specified value is a simple function
	 * @param value
	 */
	isSimpleFunction(value: unknown): value is Function;

	/**
	 * Returns true if the specified value is a generator
	 * @param value
	 */
	isGenerator(value: unknown): value is GeneratorFunction;

	/**
	 * Returns true if the specified value is an iterable structure
	 * @param value
	 */
	isIterable(value: unknown): value is IterableIterator<unknown>;

	/**
	 * Returns true if the specified value is an iterator
	 * @param value
	 */
	isIterator(value: unknown): value is Iterator<unknown>;

	/**
	 * Returns true if the specified value is a string
	 * @param value
	 */
	isString(value: unknown): value is string;

	/**
	 * Returns true if the specified value is a number
	 * @param value
	 */
	isNumber(value: unknown): value is number;

	/**
	 * Returns true if the specified value is a boolean
	 * @param value
	 */
	isBoolean(value: unknown): value is boolean;

	/**
	 * Returns true if the specified value is a symbol
	 * @param value
	 */
	isSymbol(value: unknown): value is symbol;

	/**
	 * Returns true if the specified value is a regular expression
	 * @param value
	 */
	isRegExp(value: unknown): value is RegExp;

	/**
	 * Returns true if the specified value is a date
	 * @param value
	 */
	isDate(value: unknown): value is Date;

	/**
	 * Returns true if the specified value is a promise
	 * @param value
	 */
	isPromise(value: unknown): value is Promise<unknown>;

	/**
	 * Returns true if the specified value is looks like a promise
	 * @param value
	 */
	isPromiseLike(value: unknown): value is PromiseLike<unknown>;

	/**
	 * Returns true if the specified value is a map
	 * @param value
	 */
	isMap(value: unknown): value is Map<unknown, unknown>;

	/**
	 * Returns true if the specified value is a weak map
	 * @param value
	 */
	isWeakMap(value: unknown): value is WeakMap<object, unknown>;

	/**
	 * Returns true if the specified value is a set
	 * @param value
	 */
	isSet(value: unknown): value is Set<unknown>;

	/**
	 * Returns true if the specified value is a weak set
	 * @param value
	 */
	isWeakSet(value: unknown): value is WeakSet<object>;
}

interface ArrayConstructor {
	/**
	 * Returns a curried version of Array.union
	 * @param arr
	 */
	union<T extends Nullable<unknown[]>>(arr: T): <A extends Iterable<unknown> | unknown>(
		...args: Array<Iterable<A> | A>
	) => A extends Iterable<infer V> ? Array<IterableType<T> | V> : Array<IterableType<T> | NonNullable<A>>;

	/**
	 * Returns a new array containing elements from all specified iterable values with duplicates removed.
	 * You can also pass non-iterable values and they will be added to the final array,
	 * except values with null and undefined.
	 *
	 * @param arr
	 * @param args
	 */
	union<T extends Nullable<unknown[]>, A extends Iterable<unknown> | unknown>(
		arr: T,
		...args: Array<Iterable<A> | A>
	): A extends Iterable<infer V> ? Array<IterableType<T> | V> : Array<IterableType<T> | NonNullable<A>>;

	/**
	 * Returns a curried version of Array.concat
	 * @param arr
	 */
	concat<T extends Nullable<unknown[]>>(arr: T): <A extends CanArray<unknown>>(...args: Array<CanArray<A>>) =>
		A extends Array<infer V> ? Array<IterableType<T> | V> : Array<IterableType<T> | NonNullable<A>>;

	/**
	 * Returns a new array containing elements from all specified arrays.
	 * You can also pass non-iterable values and they will be added to the final array,
	 * except values with null and undefined.
	 *
	 * @param arr
	 * @param args
	 */
	concat<T extends Nullable<unknown[]>, A extends CanArray<unknown>>(
		arr: T,
		...args: Array<CanArray<A>>
	): A extends Array<infer V> ? Array<IterableType<T> | V> : Array<IterableType<T> | NonNullable<A>>;
}

interface Array<T> {
	/**
	 * Returns a new array containing elements from all specified iterable values with duplicates removed.
	 * You can also pass non-iterable values and they will be added to the final array,
	 * except values with null and undefined.
	 *
	 * @param args
	 */
	union<A extends Iterable<unknown> | unknown>(
		...args: Array<Iterable<A> | A>
	): A extends Iterable<infer V> ? Array<T | V> : Array<T | NonNullable<A>>;
}

interface StringCapitalizeOptions {
	/**
	 * If true, then remainder of the string will be transformed to lower case
	 * @default `false`
	 */
	lower?: boolean;

	/**
	 * If true, all words in the string will be capitalized
	 * @default `false`
	 */
	all?: boolean;

	/**
	 * If false, then the operation isn't cached
	 * @default `true`
	 */
	cache?: boolean;
}

interface StringCamelizeOptions {
	/**
	 * If false, then the first character of the string will be transformed to the lower case
	 * @default `true`
	 */
	upper?: boolean;

	/**
	 * If false, then the result string won't be cached
	 * @default `true`
	 */
	cache?: boolean;
}

interface StringDasherizeOptions {
	/**
	 * If true, then the operation can be reverted
	 * @default `false`
	 */
	stable?: boolean;

	/**
	 * If false, then the operation isn't cached
	 * @default `true`
	 */
	cache?: boolean;
}

interface StringUnderscoreOptions extends StringDasherizeOptions {

}

interface StringConstructor {
	/**
	 * Returns a curried version of String.capitalize
	 * @param opts - additional options
	 */
	capitalize(opts: StringCapitalizeOptions): (str: string) => string;

	/**
	 * Capitalizes the first character of the string and returns it
	 *
	 * @param str
	 * @param [opts] - additional options
	 */
	capitalize(str: string, opts?: StringCapitalizeOptions): string;

	/**
	 * Returns a curried version of String.camelize
	 * @param upper - if false, then the first character of a value is transformed to the lower case
	 */
	camelize(upper: boolean): (str: string) => string;

	/**
	 * Returns a curried version of String.camelize
	 * @param opts - additional options
	 */
	camelize(opts: StringCamelizeOptions): (str: string) => string;

	/**
	 * Returns a CamelCaseStyle version of the specified string
	 *
	 * @param str
	 * @param [upper] - if false, then the first character of a value is transformed to the lower case
	 */
	camelize(str: string, upper?: boolean): string;

	/**
	 * Returns a CamelCaseStyle version of the specified string
	 *
	 * @param str
	 * @param [opts] - additional options
	 */
	camelize(str: string, opts?: StringCamelizeOptions): string;

	/**
	 * Returns a curried version of String.dasherize
	 * @param stable - if true, then the operation can be reverted
	 */
	dasherize(stable: boolean): (str: string) => string;

	/**
	 * Returns a curried version of String.dasherize
	 * @param opts - additional options
	 */
	dasherize(opts: StringDasherizeOptions): (str: string) => string;

	/**
	 * Returns a dash-style version of the specified string
	 *
	 * @param str
	 * @param [stable] - if true, then the operation can be reverted
	 */
	dasherize(str: string, stable?: boolean): string;

	/**
	 * Returns a dash-style version of the specified string
	 *
	 * @param str
	 * @param [opts] - additional options
	 */
	dasherize(str: string, opts?: StringDasherizeOptions): string;

	/**
	 * Returns a curried version of String.underscore
	 * @param stable - if true, then the operation can be reverted
	 */
	underscore(stable: boolean): (str: string) => string;

	/**
	 * Returns a curried version of String.underscore
	 * @param opts - additional options
	 */
	underscore(opts: StringUnderscoreOptions): (str: string) => string;

	/**
	 * Returns an underscore_style version of the specified string
	 *
	 * @param str
	 * @param [stable] - if true, then the operation can be reverted
	 */
	underscore(str: string, stable?: boolean): string;

	/**
	 * Returns an underscore_style version of the specified string
	 *
	 * @param str
	 * @param [opts] - additional options
	 */
	underscore(str: string, opts?: StringUnderscoreOptions): string;
}

interface String {
	/**
	 * Capitalizes the first character of a string and returns it
	 * @param [opts] - additional options
	 */
	capitalize(opts?: StringCapitalizeOptions): string;

	/**
	 * Returns a CamelCaseStyle version of the specified string
	 * @param [upper] - if false, then the first character of the string is transformed to the lower case
	 */
	camelize(upper?: boolean): string;

	/**
	 * Returns a CamelCaseStyle version of the specified string
	 * @param [opts] - additional options
	 */
	camelize(opts?: StringCamelizeOptions): string;

	/**
	 * Returns a dash-style version of the specified string
	 * @param [stable] - if true, then the operation can be reverted
	 */
	dasherize(stable?: boolean): string;

	/**
	 * Returns a dash-style version of the specified string
	 * @param [opts] - additional options
	 */
	dasherize(opts?: StringDasherizeOptions): string;

	/**
	 * Returns an underscore_style version of the specified string
	 * @param [stable] - if true, then the operation can be reverted
	 */
	underscore(stable?: boolean): string;

	/**
	 * Returns an underscore_style version of the specified string
	 * @param [opts] - additional options
	 */
	underscore(opts?: StringUnderscoreOptions): string;
}

type NumberOption =
	'decimal' |
	'thousands';

interface NumberConstructor {
	/**
	 * Returns an option value by the specified key
	 *
	 * @deprecated
	 * @param key
	 */
	getOption(key: NumberOption): string;

	/**
	 * Sets a new option value by the specified key
	 *
	 * @deprecated
	 * @param key
	 * @param value
	 */
	setOption(key: NumberOption, value: string): string;

	/**
	 * Returns true if the specified value is an integer number
	 * @param value
	 */
	isInteger(value: unknown): boolean;

	/**
	 * Returns true if the specified value is a float number
	 * @param value
	 */
	isFloat(value: unknown): boolean;

	/**
	 * Returns true if the specified value is an even number
	 * @param value
	 */
	isEven(value: unknown): boolean;

	/**
	 * Returns true if the specified value is an odd number
	 * @param value
	 */
	isOdd(value: unknown): boolean;

	/**
	 * Returns true if the specified value is a natural number
	 * @param value
	 */
	isNatural(value: unknown): boolean;

	/**
	 * Returns true if the specified value is a positive number
	 * @param value
	 */
	isPositive(value: unknown): boolean;

	/**
	 * Returns true if the specified value is a negative number
	 * @param value
	 */
	isNegative(value: unknown): boolean;

	/**
	 * Returns true if the specified value is a non-negative number
	 * @param value
	 */
	isNonNegative(value: unknown): boolean;

	/**
	 * Returns true if the specified value is a number and is more or equal than 0 and less or equal than 1
	 * @param value
	 */
	isBetweenZeroAndOne(value: unknown): boolean;

	/**
	 * Returns true if the specified value is a number and is more than 0 and less or equal than 1
	 * @param value
	 */
	isPositiveBetweenZeroAndOne(value: unknown): boolean;

	/**
	 * Returns a value of milliseconds from the seconds
	 */
	seconds(value: number): number;

	/**
	 * Returns a value of milliseconds from the minutes
	 */
	minutes(value: number): number;

	/**
	 * Returns a value of milliseconds from the hours
	 */
	hours(value: number): number;

	/**
	 * Returns a value of milliseconds from the days
	 */
	days(value: number): number;

	/**
	 * Returns a value of milliseconds from the weeks
	 */
	weeks(value: number): number;

	/**
	 * Returns a curried version of Number.floor
	 * @param precision
	 */
	floor(precision: number): (value: number) => number;

	/**
	 * Shortcut for Math.floor that also allows a precision
	 *
	 * @param value
	 * @param precision
	 */
	floor(value: number, precision: number): number;

	/**
	 * Returns a curried version of Number.round
	 * @param precision
	 */
	round(precision: number): (value: number) => number;

	/**
	 * Shortcut for Math.round that also allows a precision
	 *
	 * @param value
	 * @param precision
	 */
	round(value: number, precision: number): number;

	/**
	 * Returns a curried version of Number.ceil
	 * @param precision
	 */
	ceil(precision: number): (value: number) => number;

	/**
	 * Shortcut for Math.ceil that also allows a precision
	 *
	 * @param value
	 * @param precision
	 */
	ceil(value: number, precision: number): number;

	/**
	 * Returns a curried version of Number.pad
	 * @param opts - additional options
	 */
	pad(opts: NumberPadOptions): (value: string) => string;

	/**
	 * Returns a string from a number with adding extra zeros to the start, if necessary
	 *
	 * @param num
	 * @param targetLength - length of the resulting string once the current string has been padded
	 */
	pad(num: number, targetLength?: number): string;

	/**
	 * Returns a string from a number with adding extra zeros to the start, if necessary
	 *
	 * @param num
	 * @param opts - additional options
	 */
	pad(num: number, opts: NumberPadOptions): string;

	/**
	 * Returns a curried version of Number.format
	 *
	 * @param pattern
	 * @param locale
	 */
	format(pattern: string, locale?: CanArray<string>): (value: number) => string;

	/**
	 * Returns a curried version of Number.format
	 *
	 * @param opts
	 * @param locale
	 */
	format(opts: Intl.NumberFormatOptions, locale?: CanArray<string>): (value: number) => string;

	/**
	 * Returns a string representation of a number by the specified pattern.
	 * All pattern directives are based on native Intl.NumberFormat options:
	 *
	 *   1. `'style'`
	 *   1. `'currency'`
	 *   1. `'currencyDisplay'`
	 *
	 * There are aliases for all directives:
	 *
	 *   1. `'$'` - `{style: 'currency', currency: 'USD'}`
	 *   1. `'$:${currency}'` - `{style: 'currency', currency}`
	 *   1. `'$d:${currencyDisplay}'` - `{currencyDisplay}`
	 *   1. `'%'` - `{style: 'percent'}`
	 *   1. `'.'` - `{style: 'decimal'}`
	 *
	 * @param num
	 * @param pattern - string pattern of the format:
	 *   1. symbol `';'` is used as a separator character for pattern directives, for example: `'$;$d:code'`
	 *   1. symbol `':'` is used for specifying a custom value for a pattern directive, for example:
	 *    `'$:RUB;$d:code'`
	 *
	 * @param [locale] - locale for internalizing
	 *
	 * @example
	 * ```js
	 *  100.50.format('$', 'en-us') // '$100.50'
	 *  100.50.format('$:EUR;$d:code', 'en-us') // 'EUR 100.50'
	 * ```
	 */
	format(num: number, pattern?: string, locale?: CanArray<string>): string;

	/**
	 * Returns a string representation of a number by the specified options
	 *
	 * @param num
	 * @param opts - formatting options
	 * @param [locale] - locale for internalizing
	 */
	format(num: number, opts: Intl.NumberFormatOptions, locale?: CanArray<string>): string;
}

interface NumberPadOptions {
	/**
	 * Length of the resulting string once the current string has been padded
	 */
	length?: number;

	/**
	 * Value of the base to convert in a string
	 * @default `10`
	 */
	base?: number;

	/**
	 * If true, then a sign of the number will be written anyway
	 * @default `false`
	 */
	sign?: boolean;
}

interface Number {
	/**
	 * Returns a string: the value + 'em'
	 */
	em: string;

	/**
	 * Returns a string: the value + 'ex'
	 */
	ex: string;

	/**
	 * Returns a string: the value + 'rem'
	 */
	rem: string;

	/**
	 * Returns a string: the value + 'px'
	 */
	px: string;

	/**
	 * Returns a string: the value + 'per'
	 */
	per: string;

	/**
	 * Returns a string: the value + 'vh'
	 */
	vh: string;

	/**
	 * Returns a string: the value + 'vw'
	 */
	vw: string;

	/**
	 * Returns a string: the value + 'vmin'
	 */
	vmin: string;

	/**
	 * Returns a string: the value + 'vmax'
	 */
	vmax: string;

	/**
	 * Returns a value of milliseconds from the seconds
	 */
	second(): number;

	/**
	 * Returns a value of milliseconds from the seconds
	 */
	seconds(): number;

	/**
	 * Returns a value of milliseconds from the minutes
	 */
	minute(): number;

	/**
	 * Returns a value of milliseconds from the minutes
	 */
	minutes(): number;

	/**
	 * Returns a value of milliseconds from the hours
	 */
	hour(): number;

	/**
	 * Returns a value of milliseconds from the hours
	 */
	hours(): number;

	/**
	 * Returns a value of milliseconds from the days
	 */
	day(): number;

	/**
	 * Returns a value of milliseconds from the days
	 */
	days(): number;

	/**
	 * Returns a value of milliseconds from the weeks
	 */
	week(): number;

	/**
	 * Returns a value of milliseconds from the weeks
	 */
	weeks(): number;

	/**
	 * Returns true if the number is integer
	 */
	isInteger(): boolean;

	/**
	 * Returns true if the number is float
	 */
	isFloat(): boolean;

	/**
	 * Returns true if the number is even
	 */
	isEven(): boolean;

	/**
	 * Returns true if the number is odd
	 */
	isOdd(): boolean;

	/**
	 * Returns true if the number is natural
	 */
	isNatural(): boolean;

	/**
	 * Returns true if the number is positive
	 */
	isPositive(): boolean;

	/**
	 * Returns true if the number is negative
	 */
	isNegative(): boolean;

	/**
	 * Returns true if the number is non-negative
	 */
	isNonNegative(): boolean;

	/**
	 * Returns true if the number is more or equal than 0 and less or equal than 1
	 */
	isBetweenZeroAndOne(): boolean;

	/**
	 * Returns true if the number is more than 0 and less or equal than 1
	 */
	isPositiveBetweenZeroAndOne(): boolean;

	/**
	 * Returns a string from the number with adding extra zeros to the start, if necessary
	 *
	 * @param targetLength - length of the resulting string once the current string has been padded
	 * @param [opts] - additional options
	 */
	pad(targetLength?: number, opts?: NumberPadOptions): string;

	/**
	 * Returns a string representation of the number by the specified pattern.
	 * All pattern directives are based on native Intl.NumberFormat options:
	 *
	 *   1. `'style'`
	 *   1. `'currency'`
	 *   1. `'currencyDisplay'`
	 *
	 * There are aliases for all directives:
	 *
	 *   1. `'$'` - `{style: 'currency', currency: 'USD'}`
	 *   1. `'$:${currency}'` - `{style: 'currency', currency}`
	 *   1. `'$d:${currencyDisplay}'` - `{currencyDisplay}`
	 *   1. `'%'` - `{style: 'percent'}`
	 *   1. `'.'` - `{style: 'decimal'}`
	 *
	 * @param pattern - string pattern of the format:
	 *   1. symbol `';'` is used as a separator character for pattern directives, for example: `'$;$d:code'`
	 *   1. symbol `':'` is used for specifying a custom value for a pattern directive, for example:
	 *    `'$:RUB;$d:code'`
	 *
	 * @param [locale] - locale for internalizing
	 *
	 * @example
	 * ```js
	 *  100.50.format('$', 'en-us') // '$100.50'
	 *  100.50.format('$:EUR;$d:code', 'en-us') // 'EUR 100.50'
	 * ```
	 */
	format(pattern?: string, locale?: CanArray<string>): string;

	/**
	 * Returns a string representation of the number by the specified options
	 *
	 * @param opts - formatting options
	 * @param [locale] - locale for internalizing
	 */
	format(opts: Intl.NumberFormatOptions, locale?: CanArray<string>): string;

	/**
	 * Returns a string representation of the number with adding some extra formatting
	 * @param [length] - length of the decimal part
	 */
	format(length: number): string;

	/**
	 * Shortcut for Math.floor that also allows a precision
	 * @param [precision]
	 */
	floor(precision?: number): number;

	/**
	 * Shortcut for Math.round that also allows a precision
	 * @param [precision]
	 */
	round(precision?: number): number;

	/**
	 * Shortcut for Math.ceil that also allows a precision
	 * @param [precision]
	 */
	ceil(precision?: number): number;
}

interface RegExpConstructor {
	/**
	 * Returns the specified value as a string with escaping of all RegExp specific characters
	 * @param value
	 */
	escape(value: string): string;
}

type DateCreateValue =
	number |
	string |
	Date;

interface DateCreateOptions {

}

interface DateConstructor {
	/**
	 * Creates a date from the specified pattern.
	 * This method can create a new date object from:
	 *
	 *  1. another date object
	 *  1. number of milliseconds (if the number is integer)
	 *  1. number of seconds (if the number is float)
	 *  1. string pattern by using the native Date.parse with some polyfills
	 *  1. string aliases:
	 *     1. `'now'` - is an alias for the now date
	 *     1. `'today'` - is an alias for the beginning of the today
	 *     1. `'yesterday'` - is an alias for the beginning of the yesterday
	 *     1. `'tomorrow'` - is an alias for the beginning of the tomorrow
	 *
	 * @param [pattern]
	 * @param [opts]
	 *
	 * @example
	 * ```js
	 * Date.create('now'); // new Date(Date.now())
	 * Date.create(Date.now()); // new Date(Date.now())
	 * ```
	 */
	create(pattern?: DateCreateValue, opts?: DateCreateOptions): Date;

	/**
	 * Returns a list of week days
	 * @deprecated
	 */
	getWeekDays(): string[];

	/**
	 * Returns a curried version of Date.is
	 *
	 * @param margin - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 *
	 * @param date1 - date to compare
	 */
	is(margin: number, date1: DateCreateValue): (date2: DateCreateValue) => boolean;

	/**
	 * Returns a curried version of Date.is
	 * @param date1 - date to compare
	 */
	is(date1: DateCreateValue): (date2: DateCreateValue, margin?: number) => boolean;

	/**
	 * Returns true if the one date is equals to another
	 *
	 * @param date1 - date to compare
	 * @param date2 - another date to compare
	 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 */
	is(date1: DateCreateValue, date2: DateCreateValue, margin?: number): boolean;

	/**
	 * Returns a curried version of Date.isAfter
	 *
	 * @param margin - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 *
	 * @param date1 - date to compare
	 */
	isAfter(margin: number, date1: DateCreateValue): (date2: DateCreateValue) => boolean;

	/**
	 * Returns a curried version of Date.isAfter
	 * @param date1 - date to compare
	 */
	isAfter(date1: DateCreateValue): (date2: DateCreateValue, margin?: number) => boolean;

	/**
	 * Returns true if the one date is greater than another
	 *
	 * @param date1 - date to compare
	 * @param date2 - another date to compare
	 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 */
	isAfter(date1: DateCreateValue, date2: DateCreateValue, margin?: number): boolean;

	/**
	 * Returns a curried version of Date.isBefore
	 *
	 * @param margin - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 *
	 * @param date1 - date to compare
	 */
	isBefore(margin: number, date1: DateCreateValue): (date2: DateCreateValue) => boolean;

	/**
	 * Returns a curried version of Date.isBefore
	 * @param date1 - date to compare
	 */
	isBefore(date1: DateCreateValue): (date2: DateCreateValue, margin?: number) => boolean;

	/**
	 * Returns true if the one date is less than another
	 *
	 * @param date1 - date to compare
	 * @param date2 - another date to compare
	 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 */
	isBefore(date1: DateCreateValue, date2: DateCreateValue, margin?: number): boolean;

	/**
	 * Returns a curried version of Date.isBetween
	 *
	 * @param margin - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 *
	 * @param [left] - date of the beginning
	 * @param [right] - date of the ending
	 */
	isBetween(margin: number, left?: DateCreateValue, right?: DateCreateValue):
		(date: Date, left?: Date, right?: Date) => boolean;

	/**
	 * Returns a curried version of Date.isBetween
	 *
	 * @param [left] - date of the beginning
	 * @param [right] - date of the ending
	 */
	isBetween(left?: DateCreateValue, right?: DateCreateValue):
		(date: Date, left?: Date, right?: Date, margin?: number) => boolean;

	/**
	 * Returns true if the date is between of two other (including the bounding dates)
	 *
	 * @param date - date to check
	 * @param left - date of the beginning
	 * @param right - date of the ending
	 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 */
	isBetween(date: Date, left: DateCreateValue, right: DateCreateValue, margin?: number): boolean;

	/**
	 * Changes the date time so that it starts at the beginning of a day and returns it
	 * @param date
	 */
	beginningOfDay(date: Date): Date;

	/**
	 * Changes the date time so that it starts at the ending of a day and returns it
	 * @param date
	 */
	endOfDay(date: Date): Date;

	/**
	 * Changes the date so that it starts at the beginning of a week and returns it
	 * @param date
	 */
	beginningOfWeek(date: Date): Date;

	/**
	 * Changes the date so that it starts at the ending of a week and returns it
	 * @param date
	 */
	endOfWeek(date: Date): Date;

	/**
	 * Changes the date so that it starts at the beginning of a month and returns it
	 * @param date
	 */
	beginningOfMonth(date: Date): Date;

	/**
	 * Changes the date so that it starts at the ending of a month and returns it
	 * @param date
	 */
	endOfMonth(date: Date): Date;

	/**
	 * Changes the date so that it starts at the beginning of a year and returns it
	 * @param date
	 */
	beginningOfYear(date: Date): Date;

	/**
	 * Changes the date so that it starts at the ending of a year and returns it
	 * @param date
	 */
	endOfYear(date: Date): Date;

	/**
	 * Returns a curried version of Date.short
	 * @param locale - locale for internalizing
	 */
	short(locale: CanArray<string>): (date: Date) => string;

	/**
	 * Returns a short string representation of the date.
	 * This method is based on the native Intl API.
	 *
	 * @param date
	 * @param [locale] - locale for internalizing
	 *
	 * @example
	 * ```js
	 * new Date('12/28/2019').short('en-us') // '12/28/2019'
	 * ```
	 */
	short(date: Date, locale?: CanArray<string>): string;

	/**
	 * Returns a curried version of Date.medium
	 * @param locale - locale for internalizing
	 */
	medium(locale: CanArray<string>): (date: Date) => string;

	/**
	 * Returns a medium string representation of the date.
	 * This method is based on the native Intl API.
	 *
	 * @param date
	 * @param [locale] - locale for internalizing
	 *
	 * @example
	 * ```js
	 * new Date('12/28/2019').medium('en-us') // 'December 28, 2019'
	 * ```
	 */
	medium(date: Date, locale?: CanArray<string>): string;

	/**
	 * Returns a curried version of Date.long
	 * @param locale - locale for internalizing
	 */
	long(locale: CanArray<string>): (date: Date) => string;

	/**
	 * Returns a long string representation of the date.
	 * This method is based on the native Intl API.
	 *
	 * @param date
	 * @param [locale] - locale for internalizing
	 *
	 * @example
	 * ```js
	 * new Date('12/28/2019').long('en-us') // '12/28/2019, 12:00:00 A'
	 * ```
	 */
	long(date: Date, locale?: CanArray<string>): string;

	/**
	 * Returns a curried version of Date.format
	 *
	 * @param pattern
	 * @param locale
	 */
	format(pattern: string, locale?: CanArray<string>): (date: Date) => string;

	/**
	 * Returns a curried version of Date.format
	 *
	 * @param opts
	 * @param locale
	 */
	format(opts: Intl.NumberFormatOptions, locale?: CanArray<string>): (date: Date) => string;

	/**
	 * Returns a string representation of the date by the specified pattern.
	 * All pattern directives are based on native Intl.DateTimeFormat options:
	 *
	 *   1. `'era'`
	 *   1. `'year'`
	 *   1. `'month'`
	 *   1. `'day'`
	 *   1. `'weekday'`
	 *   1. `'hour'`
	 *   1. `'minute'`
	 *   1. `'second'`
	 *   1. `'timeZoneName'`
	 *
	 * There are aliases for all directives:
	 *
	 *   1. `'e'` - era
	 *   1. `'Y'` - year
	 *   1. `'M'` - month
	 *   1. `'d'` - day
	 *   1. `'w'` - weekday
	 *   1. `'h'` - hour
	 *   1. `'m'` - minute
	 *   1. `'s'` - second
	 *   1. `'z'` - timeZoneName
	 *
	 * @param date
	 * @param pattern - string pattern of the format:
	 *
	 *   1. symbol `';'` is used as a separator character for pattern directives, for example: `'year;month'`
	 *   1. symbol `':'` is used for specifying a custom value for a pattern directive, for example:
	 *    `'year:2-digit;month:short'`
	 *
	 * @param [locale] - locale for internalizing
	 *
	 * @example
	 * ```js
	 * new Date('12/28/2019').format('year', 'en-us') // '2019'
	 * new Date('12/28/2019').format('year:2-digit', 'en-us') // '19'
	 * new Date('12/28/2019').format('year:2-digit;month', 'en-us') // 'Dec 19'
	 *
	 * // Formatting a date by using short aliases
	 * new Date('12/28/2019').format('Y:2-digit;M:long;d', 'en-us') // 'December 28, 19'
	 * ```
	 */
	format(date: Date, pattern: string, locale?: CanArray<string>): string;

	/**
	 * Returns a string representation of the date by the specified options
	 *
	 * @param date
	 * @param opts - formatting options
	 * @param [locale] - locale for internalizing
	 */
	format(date: Date, opts: Intl.DateTimeFormatOptions, locale?: CanArray<string>): string;

	/**
	 * Returns a curried version of Date.toHTMLDateString
	 * @param opts - additional options
	 */
	toHTMLDateString(opts: DateHTMLDateStringOptions): (date: Date) => string;

	/**
	 * Returns an HTML string representation of the date (without time).
	 * This method is useful for providing date values within HTML tag attributes.
	 *
	 * @param date
	 * @param [opts] - additional options
	 */
	toHTMLDateString(date: Date, opts?: DateHTMLDateStringOptions): string;

	/**
	 * Returns a curried version of Date.toHTMLTimeString
	 * @param opts - additional options
	 */
	toHTMLTimeString(opts: DateHTMLDateStringOptions): (date: Date) => string;

	/**
	 * Returns an HTML string representation of a timestamp from the date.
	 * This method is useful for providing timestamp values within HTML tag attributes.
	 *
	 * @param date
	 * @param [opts] - additional options
	 */
	toHTMLTimeString(date: Date, opts?: DateHTMLTimeStringOptions): string;

	/**
	 * Returns a curried version of Date.toHTMLString
	 * @param opts - additional options
	 */
	toHTMLString(opts: DateHTMLDateStringOptions): (date: Date) => string;

	/**
	 * Returns an HTML string representation of a datetime from the date.
	 * This method is useful for providing datetime values within HTML tag attributes.
	 *
	 * @param date
	 * @param [opts] - additional options
	 */
	toHTMLString(date: Date, opts?: DateHTMLStringOptions): string;

	/**
	 * Returns a curried version of Date.add
	 *
	 * @param units
	 * @param reset - if true, then all lower units will be reset to zero
	 */
	add(units: DateSetParams, reset?: boolean): (date: Date) => Date;

	/**
	 * Modifies the date with adding time units
	 *
	 * @param date
	 * @param units
	 * @param reset - if true, then all lower units will be reset to zero
	 */
	add(date: Date, units: DateSetParams, reset?: boolean): Date;

	/**
	 * Returns a curried version of Date.set
	 *
	 * @param units
	 * @param reset - if true, then all lower units will be reset to zero
	 */
	set(units: DateSetParams, reset?: boolean): (date: Date) => Date;

	/**
	 * Modifies the date with setting time units
	 *
	 * @param date
	 * @param units
	 * @param reset - if true, then all lower units will be reset to zero
	 */
	set(date: Date, units: DateSetParams, reset?: boolean): Date;

	/**
	 * Returns a curried version of Date.rewind
	 *
	 * @param units
	 * @param reset - if true, then all lower units will be reset to zero
	 */
	rewind(units: DateSetParams, reset?: boolean): (date: Date) => Date;

	/**
	 * Modifies the date with subtracting time units
	 *
	 * @param date
	 * @param units
	 * @param reset - if true, then all lower units will be reset to zero
	 */
	rewind(date: Date, units: DateSetParams, reset?: boolean): Date;

	/**
	 * Returns a relative value of the date for the now date
	 * @param date
	 */
	relative(date: DateCreateValue): DateRelative;

	/**
	 * Returns a curried version of Date.relativeTo
	 * @param from - original date to compare
	 */
	relativeTo(from: DateCreateValue): (to: DateCreateValue) => DateRelative;

	/**
	 * Returns a relative value of the date for another date
	 *
	 * @param from - original date to compare
	 * @param to - another date to compare
	 */
	relativeTo(from: DateCreateValue, to: DateCreateValue): DateRelative;
}

interface DateSetParams {
	millisecond?: number;
	milliseconds?: number;
	second?: number;
	seconds?: number;
	minute?: number;
	minutes?: number;
	hour?: number;
	hours?: number;
	day?: number;
	days?: number;
	month?: number;
	months?: number;
	year?: number;
	years?: number;
}

interface DateHTMLDateStringOptions {
	/**
	 * If false, then a date month is taken from the beginning of the now year
	 * @default `true`
	 */
	month?: boolean;

	/**
	 * If false, then a date day is taken from the beginning of the now month
	 * @default `true`
	 */
	date?: boolean;
}

interface DateHTMLTimeStringOptions {
	/**
	 * If false, then a date month is taken from the beginning of the now hour
	 * @default `true`
	 */
	minutes?: boolean;

	/**
	 * If false, then a date second is taken from the beginning of the now minute
	 * @default `true`
	 */
	seconds?: boolean;

	/**
	 * If false, then a date millisecond is taken from the beginning of the now second
	 * @default `true`
	 */
	milliseconds?: boolean;
}

type DateHTMLStringOptions =
	DateHTMLTimeStringOptions &
	DateHTMLDateStringOptions;

type DateRelativeType =
	'milliseconds' |
	'seconds' |
	'minutes' |
	'hours' |
	'days' |
	'weeks' |
	'months' |
	'years';

interface DateRelative {
	type: DateRelativeType;
	value: number;
	diff: number;
}

interface Date {
	/**
	 * Clones the date object and returns a new object
	 */
	clone(): Date;

	/**
	 * Returns true if the date is equals to another
	 *
	 * @param date - another date to compare
	 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 */
	is(date: DateCreateValue, margin?: number): boolean;

	/**
	 * Returns true if the date is greater than another
	 *
	 * @param date - another date to compare
	 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 */
	isAfter(date: DateCreateValue, margin?: number): boolean;

	/**
	 * Returns true if the date is less than another
	 *
	 * @param date - another date to compare
	 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 */
	isBefore(date: DateCreateValue, margin?: number): boolean;

	/**
	 * Returns true if the date is between of two other (including the bounding dates)
	 *
	 * @param left - date of the beginning
	 * @param right - date of the ending
	 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 */
	isBetween(left: DateCreateValue, right: DateCreateValue, margin?: number): boolean;

	/**
	 * Returns true if the date is less than the now date
	 */
	isPast(): boolean;

	/**
	 * Returns true if the date is greater than the now date
	 */
	isFuture(): boolean;

	/**
	 * Changes the date time so that it starts at the beginning of a day and returns it
	 */
	beginningOfDay(): Date;

	/**
	 * Changes the date time so that it starts at the ending of a day and returns it
	 */
	endOfDay(): Date;

	/**
	 * Changes the date so that it starts at the beginning of a week and returns it
	 */
	beginningOfWeek(): Date;

	/**
	 * Changes the date so that it starts at the ending of a week and returns it
	 */
	endOfWeek(): Date;

	/**
	 * Changes the date so that it starts at the beginning of a month and returns it
	 */
	beginningOfMonth(): Date;

	/**
	 * Changes the date so that it starts at the ending of a month and returns it
	 */
	endOfMonth(): Date;

	/**
	 * Changes the date so that it starts at the beginning of a year and returns it
	 */
	beginningOfYear(): Date;

	/**
	 * Changes the date so that it starts at the ending of a year and returns it
	 */
	endOfYear(): Date;

	/**
	 * Returns a short string representation of the date.
	 * This method is based on the native Intl API.
	 *
	 * @param [locale] - locale for internalizing
	 *
	 * @example
	 * ```js
	 * new Date('12/28/2019').short('en-us') // '12/28/2019'
	 * ```
	 */
	short(locale?: CanArray<string>): string;

	/**
	 * Returns a medium string representation of the date.
	 * This method is based on the native Intl API.
	 *
	 * @param [locale] - locale for internalizing
	 *
	 * @example
	 * ```js
	 * new Date('12/28/2019').medium('en-us') // 'December 28, 2019'
	 * ```
	 */
	medium(locale?: CanArray<string>): string;

	/**
	 * Returns a long string representation of the date.
	 * This method is based on the native Intl API.
	 *
	 * @param [locale] - locale for internalizing
	 *
	 * @example
	 * ```js
	 * new Date('12/28/2019').long('en-us') // '12/28/2019, 12:00:00 A'
	 * ```
	 */
	long(locale?: CanArray<string>): string;

	/**
	 * Returns a string representation of the date by the specified pattern.
	 * All pattern directives are based on native Intl.DateTimeFormat options:
	 *
	 *   1. `'era'`
	 *   1. `'year'`
	 *   1. `'month'`
	 *   1. `'day'`
	 *   1. `'weekday'`
	 *   1. `'hour'`
	 *   1. `'minute'`
	 *   1. `'second'`
	 *   1. `'timeZoneName'`
	 *
	 * There are aliases for all directives:
	 *
	 *   1. `'e'` - era
	 *   1. `'Y'` - year
	 *   1. `'M'` - month
	 *   1. `'d'` - day
	 *   1. `'w'` - weekday
	 *   1. `'h'` - hour
	 *   1. `'m'` - minute
	 *   1. `'s'` - second
	 *   1. `'z'` - timeZoneName
	 *
	 * @param pattern - string pattern of the format:
	 *
	 *   1. symbol `';'` is used as a separator character for pattern directives, for example: `'year;month'`
	 *   1. symbol `':'` is used for specifying a custom value for a pattern directive, for example:
	 *    `'year:2-digit;month:short'`
	 *
	 * @param [locale] - locale for internalizing
	 *
	 * @example
	 * ```js
	 * new Date('12/28/2019').format('year', 'en-us') // '2019'
	 * new Date('12/28/2019').format('year:2-digit', 'en-us') // '19'
	 * new Date('12/28/2019').format('year:2-digit;month', 'en-us') // 'Dec 19'
	 *
	 * // Formatting a date by using short aliases
	 * new Date('12/28/2019').format('Y:2-digit;M:long;d', 'en-us') // 'December 28, 19'
	 * ```
	 */
	format(pattern: string, locale?: CanArray<string>): string;

	/**
	 * Returns a string representation of the date by the specified options
	 *
	 * @param opts - formatting options
	 * @param [locale] - locale for internalizing
	 */
	format(opts: Intl.DateTimeFormatOptions, locale?: CanArray<string>): string;

	/**
	 * Returns an HTML string representation of the date (without time).
	 * This method is useful for providing date values within HTML tag attributes.
	 *
	 * @param [opts] - additional options
	 */
	toHTMLDateString(opts?: DateHTMLDateStringOptions): string;

	/**
	 * Returns an HTML string representation of a timestamp from the date.
	 * This method is useful for providing timestamp values within HTML tag attributes.
	 *
	 * @param [opts] - additional options
	 */
	toHTMLTimeString(opts?: DateHTMLTimeStringOptions): string;

	/**
	 * Returns an HTML string representation of a datetime from the date.
	 * This method is useful for providing datetime values within HTML tag attributes.
	 *
	 * @param [opts] - additional options
	 */
	toHTMLString(opts?: DateHTMLStringOptions): string;

	/**
	 * Modifies the date with adding time units
	 *
	 * @param units
	 * @param reset - if true, then all lower units will be reset to zero
	 */
	add(units: DateSetParams, reset?: boolean): Date;

	/**
	 * Modifies the date with setting time units
	 *
	 * @param units
	 * @param reset - if true, then all lower units will be reset to zero
	 */
	set(units: DateSetParams, reset?: boolean): Date;

	/**
	 * Modifies the date with subtracting time units
	 *
	 * @param units
	 * @param reset - if true, then all lower units will be reset to zero
	 */
	rewind(units: DateSetParams, reset?: boolean): Date;

	/**
	 * Returns a relative value of the date for the now date
	 */
	relative(): DateRelative;

	/**
	 * Returns a relative value of the date for another date
	 * @param date - another date to compare
	 */
	relativeTo(date: DateCreateValue): DateRelative;

	/**
	 * Returns a number of days in the date month
	 */
	daysInMonth(): number;
}

interface FunctionConstructor {
	/**
	 * Link to the special functional placeholder that can be used with curried functions
	 *
	 * @example
	 * ```js
	 * function sum(a, b) {
	 *   return a + b;
	 * }
	 *
	 * sum.curry()(Function.__, 2)(5)
	 * ```
	 */
	__: TB.__;

	/**
	 * Returns a new function that allows to invoke the specified function only once
	 * @param fn
	 */
	once<T extends AnyFunction>(fn: T): T;

	/**
	 * Returns a new function that allows to invoke a function, which it takes, only with the specified delay.
	 * The next invocation of the function will cancel the previous.
	 *
	 * @param delay
	 */
	debounce(delay: number): <A extends unknown[]>(fn: AnyFunction<A>) => AnyFunction<A, void>;

	/**
	 * Returns a new function that allows to invoke the function only with the specified delay.
	 * The next invocation of the function will cancel the previous.
	 *
	 * @param fn
	 * @param [delay]
	 */
	debounce<A extends unknown[]>(fn: AnyFunction<A>, delay?: number): AnyFunction<A, void>;

	/**
	 * Returns a new function that allows to invoke a function, which it takes, not more often than the specified delay
	 * @param delay
	 */
	throttle(delay: number): <A extends unknown[]>(fn: AnyFunction<A>) => AnyFunction<A, void>;

	/**
	 * Returns a new function that allows to invoke the function not more often than the specified delay
	 *
	 * @param fn
	 * @param [delay]
	 */
	throttle<A extends unknown[]>(fn: AnyFunction<A>, delay?: number): AnyFunction<A, void>;

	/**
	 * Returns a curried equivalent of the provided function.
	 *
	 * The curried function has two unusual capabilities.
	 * First, its arguments needn't be provided one at a time.
	 * If f is a ternary function and g is Function.curry(f), the following are equivalent:
	 *
	 * ```js
	 * g(1)(2)(3)
	 * g(1)(2, 3)
	 * g(1, 2)(3)
	 * g(1, 2, 3)
	 * ```
	 *
	 * Secondly, the special placeholder value Function.__ may be used to specify "gaps", allowing partial application
	 * of any combination of arguments, regardless of their positions. If g is as above and _ is Function.__,
	 * the following are equivalent:
	 *
	 * ```js
	 * g(1, 2, 3)
	 * g(_, 2, 3)(1)
	 * g(_, _, 3)(1)(2)
	 * g(_, _, 3)(1, 2)
	 * g(_, 2)(1)(3)
	 * g(_, 2)(1, 3)
	 * g(_, 2)(_, 3)(1)
	 * ```
	 */
	curry<T extends AnyFunction>(f: T): TB.Curry<T>;

	/**
	 * Performs right-to-left function composition.
	 * The last argument may have any arity; the remaining arguments must be unary.
	 *
	 * If any function from parameters returns a Promise, the next function from the parameters
	 * will take the resolved value of that promise,
	 * the final result of calling the composition function is also a promise.
	 *
	 * @param fn0
	 */
	compose<A extends unknown[], T1>(fn0: AnyFunction<A, T1>): AnyFunction<A, T1>;

	compose<A extends unknown[], T1, T2>(
		fn1: AnyOneArgFunction<PromiseType<T1>, T2>,
		fn0: AnyFunction<A, T1>
	): AnyFunction<A, T1 extends Promise<any> ? NewPromise<T1, T2> : T2>;

	compose<A extends unknown[], T1, T2, T3>(
		fn2: AnyOneArgFunction<PromiseType<T2>, T3>,
		fn1: AnyOneArgFunction<PromiseType<T1>, T2>,
		fn0: AnyFunction<A, T1>
	): AnyFunction<A, T2 extends Promise<any> ? Promise<T3> : T1 extends Promise<any> ? Promise<T3> : T3>;

	compose<A extends unknown[], T1, T2, T3, T4>(
		fn3: AnyOneArgFunction<PromiseType<T3>, T4>,
		fn2: AnyOneArgFunction<PromiseType<T2>, T3>,
		fn1: AnyOneArgFunction<PromiseType<T1>, T2>,
		fn0: AnyFunction<A, T1>
	): AnyFunction<
		A,
		T3 extends Promise<any> ?
			Promise<T4> : T2 extends Promise<any> ?
				Promise<T4> : T1 extends Promise<any> ?
					Promise<T4> : T4
	>;

	compose<A extends unknown[], T1, T2, T3, T4, T5>(
		fn4: AnyOneArgFunction<PromiseType<T4>, T5>,
		fn3: AnyOneArgFunction<PromiseType<T3>, T4>,
		fn2: AnyOneArgFunction<PromiseType<T2>, T3>,
		fn1: AnyOneArgFunction<PromiseType<T1>, T2>,
		fn0: AnyFunction<A, T1>
	): AnyFunction<
		A,
		T4 extends Promise<any> ?
			Promise<T5> : T3 extends Promise<any> ?
				Promise<T5> : T2 extends Promise<any> ?
					Promise<T5> : T1 extends Promise<any> ?
						Promise<T5> : T5
	>;

	compose<A extends unknown[], T1, T2, T3, T4, T5, T6>(
		fn5: AnyOneArgFunction<PromiseType<T5>, T6>,
		fn4: AnyOneArgFunction<PromiseType<T4>, T5>,
		fn3: AnyOneArgFunction<PromiseType<T3>, T4>,
		fn2: AnyOneArgFunction<PromiseType<T2>, T3>,
		fn1: AnyOneArgFunction<PromiseType<T1>, T2>,
		fn0: AnyFunction<A, T1>
	): AnyFunction<
		A,
		T5 extends Promise<any> ?
			Promise<T6> : T4 extends Promise<any> ?
				Promise<T6> : T3 extends Promise<any> ?
					Promise<T6> : T2 extends Promise<any> ?
						Promise<T6> : T1 extends Promise<any> ?
							Promise<T6> : T6
		>;
}

interface Function {
	name: string;

	/**
	 * Returns a new function that allows to invoke the target function only once
	 */
	once<T>(this: T): T;

	/**
	 * Returns a new function that allows to invoke the target function only with the specified delay.
	 * The next invocation of the function will cancel the previous.
	 *
	 * @param [delay]
	 */
	debounce<T extends AnyFunction>(this: T, delay?: number): AnyFunction<Parameters<T>, void>;

	/**
	 * Returns a new function that allows to invoke the target function not more often than the specified delay
	 * @param [delay]
	 */
	throttle<T extends AnyFunction>(this: T, delay?: number): AnyFunction<Parameters<T>, void>;

	/**
	 * Returns a new function based on the target that wraps the returning value into the Either structure.
	 * If the first argument of the created function is taken null or undefined, the function returns the rejected value.
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * toLowerCase.option()(null).catch((err) => err === null);
	 * toLowerCase.option()(1).catch((err) => err.message === 'str.toLowerCase is not a function');
	 *
	 * toLowerCase.option()('FOO').then((value) => value === 'foo');
	 * toLowerCase.option()(toLowerCase.option()('FOO')).then((value) => value === 'foo');
	 * ```
	 */
	option<R>(this: () => R): AnyFunction<any[], Maybe<R>>;

	/**
	 * Returns a new function based on the target that wraps the returning value into the Either structure.
	 * If the first argument of the created function is taken null or undefined, the function returns the rejected value.
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * toLowerCase.option()(null).catch((err) => err === null);
	 * toLowerCase.option()(1).catch((err) => err.message === 'str.toLowerCase is not a function');
	 *
	 * toLowerCase.option()('FOO').then((value) => value === 'foo');
	 * toLowerCase.option()(toLowerCase.option()('FOO')).then((value) => value === 'foo');
	 * ```
	 */
	option<A1, A extends unknown[], R>(this: (a1: A1, a: A) => R):
		AnyFunction<[Maybe<Nullable<A1>> | Either<A1> | Nullable<A1>, ...A], Maybe<R>>;

	/**
	 * Returns a new function based on the target that wraps the returning value into the Either structure
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * toLowerCase.result()(1).catch((err) => err.message === 'str.toLowerCase is not a function');
	 * toLowerCase.result()('FOO').then((value) => value === 'foo');
	 * toLowerCase.result()(toLowerCase.result()('FOO')).then((value) => value === 'foo');
	 * ```
	 */
	result<R>(this: () => R): AnyFunction<any[], Either<R>>;

	/**
	 * Returns a new function based on the target that wraps the returning value into the Either structure
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * toLowerCase.result()(1).catch((err) => err.message === 'str.toLowerCase is not a function');
	 * toLowerCase.result()('FOO').then((value) => value === 'foo');
	 * toLowerCase.result()(toLowerCase.result()('FOO')).then((value) => value === 'foo');
	 * ```
	 */
	result<A1, A extends unknown[], R>(this: (a1: A1, a: A) => R): AnyFunction<[Maybe<A1> | Either<A1>, ...A], Maybe<R>>;

	/**
	 * Returns a curried equivalent of the function.
	 *
	 * The curried function has two unusual capabilities.
	 * First, its arguments needn't be provided one at a time.
	 * If f is a ternary function and g is f.curry(), the following are equivalent:
	 *
	 * ```js
	 * g(1)(2)(3)
	 * g(1)(2, 3)
	 * g(1, 2)(3)
	 * g(1, 2, 3)
	 * ```
	 *
	 * Secondly, the special placeholder value Function.__ may be used to specify "gaps", allowing partial application
	 * of any combination of arguments, regardless of their positions. If g is as above and _ is Function.__,
	 * the following are equivalent:
	 *
	 * ```js
	 * g(1, 2, 3)
	 * g(_, 2, 3)(1)
	 * g(_, _, 3)(1)(2)
	 * g(_, _, 3)(1, 2)
	 * g(_, 2)(1)(3)
	 * g(_, 2)(1, 3)
	 * g(_, 2)(_, 3)(1)
	 * ```
	 */
	curry<T extends AnyFunction>(this: T): TB.Curry<T>;

	/**
	 * Performs left-to-right function composition.
	 * The first argument may have any arity; the remaining arguments must be unary.
	 *
	 * If any function from parameters returns a Promise, the next function from the parameters
	 * will take the resolved value of that promise,
	 * the final result of calling the composition function is also a promise.
	 */
	compose<T>(this: T): T;

	compose<A extends unknown[], T1, T2>(
		this: AnyFunction<A, T1>,
		fn1: AnyOneArgFunction<T1, T2>
	): AnyFunction<A, T1 extends Promise<any> ? Promise<T2> : T2>;

	compose<A extends unknown[], T1, T2, T3>(
		this: AnyFunction<A, T1>,
		fn1: AnyOneArgFunction<T1, T2>,
		fn2: AnyOneArgFunction<T2, T3>
	): AnyFunction<A, T2 extends Promise<any> ? Promise<T3> : T1 extends Promise<any> ? Promise<T3> : T3>;

	compose<A extends unknown[], T1, T2, T3, T4>(
		this: AnyFunction<A, T1>,
		fn1: AnyOneArgFunction<T1, T2>,
		fn2: AnyOneArgFunction<T2, T3>,
		fn3: AnyOneArgFunction<T3, T4>
	): AnyFunction<
		A,
		T3 extends Promise<any> ?
			Promise<T4> : T2 extends Promise<any> ?
				Promise<T4> : T1 extends Promise<any> ?
					Promise<T4> : T4
	>;

	compose<A extends unknown[], T1, T2, T3, T4, T5>(
		this: AnyFunction<A, T1>,
		fn1: AnyOneArgFunction<T1, T2>,
		fn2: AnyOneArgFunction<T2, T3>,
		fn3: AnyOneArgFunction<T3, T4>,
		fn4: AnyOneArgFunction<T4, T5>
	): AnyFunction<
		A,
		T4 extends Promise<any> ?
			Promise<T5> : T3 extends Promise<any> ?
				Promise<T5> : T2 extends Promise<any> ?
					Promise<T5> : T1 extends Promise<any> ?
						Promise<T5> : T5
	>;

	compose<A extends unknown[], T1, T2, T3, T4, T5, T6>(
		this: AnyFunction<A, T1>,
		fn1: AnyOneArgFunction<T1, T2>,
		fn2: AnyOneArgFunction<T2, T3>,
		fn3: AnyOneArgFunction<T3, T4>,
		fn4: AnyOneArgFunction<T4, T5>,
		fn5: AnyOneArgFunction<T5, T6>
	): AnyFunction<
		A,
		T5 extends Promise<any> ?
			Promise<T6> : T4 extends Promise<any> ?
				Promise<T6> : T3 extends Promise<any> ?
					Promise<T6> : T2 extends Promise<any> ?
						Promise<T6> : T1 extends Promise<any> ?
							Promise<T6> : T6
		>;
}
