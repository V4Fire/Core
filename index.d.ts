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

// tslint:disable:max-file-line-count unified-signatures

declare const APP_NAME: string;
declare const API_URL: CanUndef<string>;
declare const IS_PROD: boolean;
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
 * dev/null wrapper
 * @param obj
 */
declare function devNull(obj: unknown): void;

/**
 * Global i18n function (can be used as a string tag or a simple function)
 */
declare function i18n(strings: unknown | string[], ...expr: unknown[]): string;

/**
 * @alias
 * @see globalI18n
 */
declare function t(strings: unknown | string[], ...expr: unknown[]): string;

/**
 * Global i18n loopback (can be used as a string tag or a simple function)
 */
declare function l(strings: unknown | string[], ...expr: unknown[]): string;

declare class IdleDeadline {
	readonly didTimeout: boolean;
	timeRemaining(): number;
}

declare function requestIdleCallback(fn: (deadline: IdleDeadline) => void, opts?: {timer?: number}): number;
declare function cancelIdleCallback(id: number): void;

declare function setImmediate(fn: Function): number;
declare function clearImmediate(id: number): void;

type Optional<T = unknown, TVAL = T, SAFE = TVAL> = T extends null | undefined ?
	undefined : T extends SAFE ? TVAL : CanUndef<TVAL>;

type Nullable<T> = T | null | undefined;
type CanPromise<T> = T | Promise<T>;
type CanUndef<T> = T | undefined;
type CanVoid<T> = T | void;
type CanArray<T> = T | T[];

type AnyFunction<ARGS extends any[] = any[], R = any> =
	((...args: ARGS) => R) |
	Function;

interface ClassConstructor<T = unknown> {new: T}
interface StrictDictionary<T = unknown> {[key: string]: T}
interface Dictionary<T> {[key: string]: CanUndef<T>}
interface Dictionary<T extends unknown = unknown> {[key: string]: T}

type DictionaryType<T extends Dictionary> = T extends Dictionary<infer V> ? NonNullable<V> : T;
type IterableType<T extends Iterable<unknown>> = T extends Iterable<infer V> ? V : T;
type PromiseType<T extends Promise<unknown>> = T extends Promise<infer V> ? V : T;

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
	 * If true, then descriptors of object properties are copied too
	 * @default `false`
	 */
	withDescriptor?: boolean;

	/**
	 * If true, then accessors (but not all descriptors) of object properties are copied too
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
	 * If true, then for merging two arrays will be used a concatenation strategy
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
	 * Character for declaring the path
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
	 * If true, then a new value will be concatenated with the old within an array
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
	 * Strategy for not own properties of an object:
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
	 * @param i - element index
	 * @param el - element value
	 */
	keyConverter?(i: number, el: unknown): string | symbol;

	/**
	 * Function that returns an element value
	 *
	 * @param el - element value
	 * @param i - element index
	 */
	valueConverter?(el: unknown, i: number): T;
}

type ObjectPropertyPath =
	string |
	unknown[];

interface ObjectConstructor {
	/**
	 * Returns a value from an object by the specified path
	 *
	 * @param obj
	 * @param path
	 * @param [opts] - additional options
	 */
	get<T = unknown>(obj: unknown, path: ObjectPropertyPath, opts?: ObjectGetOptions): T;

	/**
	 * Returns a function that returns a value from an object, which the function takes, by the specified path
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
	 * Returns a function that returns true if an object, which the function takes, has own property by the specified key
	 * @param key
	 */
	hasOwnProperty(key: string): (obj: unknown) => boolean;

	/**
	 * Returns a function that returns true if the specified object has own property by a key the the function takes
	 * @param obj
	 */
	hasOwnProperty(obj: unknown): (key: string) => boolean;

	/**
	 * Returns true if an object has an own property by the specified key
	 *
	 * @param obj
	 * @param key
	 */
	hasOwnProperty(obj: unknown, key: string): boolean;

	/**
	 * Sets a value to an object by the specified path.
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
	 * Returns a function that clones an object, which the function takes,
	 * by using a naive but fast "JSON.stringify/parse" strategy and returns a new object
	 *
	 * @param obj
	 * @param opts - additional options
	 */
	fastClone(obj: undefined, opts: FastCloneOptions): <T>(obj: T) => T;

	/**
	 * Clones the specified object by using a naive but fast "JSON.stringify/parse" strategy and returns a new object
	 *
	 * @param obj
	 * @param [opts] - additional options
	 */
	fastClone<T>(obj: T, opts?: FastCloneOptions): T;

	/**
	 * Returns a string representation of the specified object by using a naive but fast "JSON.stringify/parse" strategy
	 * @param obj
	 */
	fastHash(obj: unknown): string;

	/**
	 * Returns a curried version of Object.mixin for one argument
	 * @param opts - if true, then properties will be copied recursively OR additional options for extending
	 */
	mixin(opts: ObjectMixinOptions | boolean): <B, O1>(base: B, obj1: O1) => B & O1;

	/**
	 * Returns a curried version of Object.mixin for one argument
	 * @param opts - if true, then properties will be copied recursively OR additional options for extending
	 */
	mixin(opts: ObjectMixinOptions | boolean): <R = unknown>(...objects: unknown[]) => R;

	/**
	 * Returns a curried version of Object.mixin for two arguments
	 *
	 * @param opts - if true, then properties will be copied recursively OR additional options for extending
	 * @param base - base object
	 */
	mixin<B>(opts: ObjectMixinOptions | boolean, base: B): <O1>(obj1: O1) => B & O1;

	/**
	 * Returns a curried version of Object.mixin for two arguments
	 *
	 * @param opts - if true, then properties will be copied recursively OR additional options for extending
	 * @param base - base object
	 */
	mixin(opts: ObjectMixinOptions | boolean, base: unknown): <R = unknown>(...objects: unknown[]) => R;

	/**
	 * Extends the specified object by another objects.
	 * If the base value is not an object, a new object will be created with a type similar to the first extension object.
	 *
	 * @param opts - if true, then properties will be copied recursively OR additional options for extending
	 * @param base - base object
	 * @param obj1 - object for extending
	 */
	mixin<B, O1>(opts: ObjectMixinOptions | boolean, base?: B, obj1: O1): B & O1;

	/**
	 * Extends the specified object by another objects.
	 * If the base value is not an object, a new object will be created with a type similar to the first extension object.
	 *
	 * @param opts - if true, then properties will be copied recursively OR additional options for extending
	 * @param base - base object
	 * @param obj1 - object for extending
	 * @param obj2 - object for extending
	 */
	mixin<B, O1, O2>(opts: ObjectMixinOptions | boolean, base?: B, obj1: O1, obj2: O2): B & O1 & O2;

	/**
	 * Extends the specified object by another objects.
	 * If the base value is not an object, a new object will be created with a type similar to the first extension object.
	 *
	 * @param opts - if true, then properties will be copied recursively OR additional options for extending
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
	 * @param opts - if true, then properties will be copied recursively OR additional options for extending
	 * @param base - base object
	 * @param objects - objects for extending
	 */
	mixin<R = unknown>(opts: ObjectMixinOptions | boolean, base?: unknown, ...objects: unknown[]): R;

	/**
	 * Returns a function that parse a value, which it takes, as a JSON/JS object and returns the result of parsing.
	 * If the value isn't a string or can't be parsed, the function returns an original value.
	 *
	 * @param reviver - reviver function for JSON.parse
	 */
	parse(reviver?: JSONCb): <V, R = unknown>(value: V) => V extends string ? R : V;

	/**
	 * Parses the specified value as a JSON/JS object and returns the result of parsing.
	 * If the value isn't a string or can't be parsed, the function returns an original value.
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
	 * Creates an object which has the similar structure to a TS enum object and returns it
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
	 */
	fromArray<T>(arr: unknown[], opts?: ObjectFromArrayOptions<T>): Dictionary<T>;

	/**
	 * Returns a function that returns a new object based on an object that the function takes,
	 * but only with fields that match to the specified condition
	 *
	 * @param condition - regular expression to filter
	 */
	select(condition: RegExp): <D extends object>(obj: D) => {[K in keyof D]?: D[K]};

	/**
	 * Returns a function that returns a new object based on an object that the function takes,
	 * but only with fields that match to the specified condition
	 *
	 * @param condition - whitelist of keys to filter
	 */
	select<C extends string>(condition: CanArray<C>): <D extends object>(obj: D) => Pick<D, Extract<keyof D, C>>;

	/**
	 * Returns a function that returns a new object based on an object that the function takes,
	 * but only with fields that match to the specified condition
	 *
	 * @param condition - whitelist of keys to filter
	 */
	select<C extends string>(condition: Iterable<C>): <D extends object>(obj: D) => {[K in keyof D]?: D[K]};

	/**
	 * Returns a function that returns a new object based on an object that the function takes,
	 * but only with fields that match to the specified condition
	 *
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
	select<D extends object, C extends string>(obj: D, condition: CanArray<C>): Pick<D, Extract<keyof D, C>>;

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
	 * Returns a function that returns a new object based on an object that the function takes,
	 * but without fields that match to the specified condition
	 *
	 * @param condition - regular expression to filter
	 */
	reject(condition: RegExp): <D extends object>(obj: D) => {[K in keyof D]?: D[K]};

	/**
	 * Returns a function that returns a new object based on an object that the function takes,
	 * but without fields that match to the specified condition
	 *
	 * @param condition - whitelist of keys to filter
	 */
	reject<C extends string>(condition: CanArray<C>): <D extends object>(obj: D) => Omit<D, C>;

	/**
	 * Returns a function that returns a new object based on an object that the function takes,
	 * but without fields that match to the specified condition
	 *
	 * @param condition - whitelist of keys to filter
	 */
	reject<C extends string>(condition: Iterable<C>): <D extends object>(obj: D) => {[K in keyof D]?: D[K]};

	/**
	 * Returns a function that returns a new object based on an object that the function takes,
	 * but without fields that match to the specified condition
	 *
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
	reject<D extends object, C extends string>(obj: D, condition: CanArray<C>): Omit<D, C>;

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
			Function |

			Number |
			String |
			Symbol |
			Boolean |

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
	 * This method is similar to isPlainObject, but it has another output TS type:
	 * instead of inferring of an output type the method always cast the type to a dictionary.
	 *
	 * @param obj
	 *
	 * @example
	 * ```ts
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
	isDictionary(obj: unknown): obj is Dictionary;

	/**
	 * @deprecated
	 * @see [[ObjectConstructor.isPlainObject]]
	 * @see [[ObjectConstructor.isDictionary]]
	 */
	isObject(obj: unknown): obj is Dictionary;

	/**
	 * Returns true if the specified value has a primitive type
	 * @param obj
	 */
	isPrimitive(obj: unknown): boolean;

	/**
	 * Returns true if the specified value is a custom (not native) object or a function
	 * @param obj
	 */
	isCustomObject(obj: unknown): boolean;

	/**
	 * Returns true if the specified value is a simple object (without a string type tag)
	 * @param obj
	 */
	isSimpleObject<T extends object = object>(obj: unknown): obj is T;

	/**
	 * Returns true if the specified value is an array
	 * @param obj
	 */
	isArray(obj: unknown): obj is unknown[];

	/**
	 * Returns true if the specified value is looks like an array
	 * @param obj
	 */
	isArrayLike(obj: unknown): obj is ArrayLike;

	/**
	 * Returns true if the specified value is a function
	 * @param obj
	 */
	isFunction(obj: unknown): obj is Function;

	/**
	 * Returns true if the specified value is a generator
	 * @param obj
	 */
	isGenerator(obj: unknown): obj is GeneratorFunction;

	/**
	 * Returns true if the specified value is an iterable structure
	 * @param obj
	 */
	isIterable(obj: unknown): obj is IterableIterator<unknown>;

	/**
	 * Returns true if the specified value is an iterator
	 * @param obj
	 */
	isIterator(obj: unknown): obj is Iterator<unknown>;

	/**
	 * Returns true if the specified value is a string
	 * @param obj
	 */
	isString(obj: unknown): obj is string;

	/**
	 * Returns true if the specified value is a number
	 * @param obj
	 */
	isNumber(obj: unknown): obj is number;

	/**
	 * Returns true if the specified value is a boolean
	 * @param obj
	 */
	isBoolean(obj: unknown): obj is boolean;

	/**
	 * Returns true if the specified value is a symbol
	 * @param obj
	 */
	isSymbol(obj: unknown): obj is symbol;

	/**
	 * Returns true if the specified value is a regular expression
	 * @param obj
	 */
	isRegExp(obj: unknown): obj is RegExp;

	/**
	 * Returns true if the specified value is a date
	 * @param obj
	 */
	isDate(obj: unknown): obj is Date;

	/**
	 * Returns true if the specified value is a promise
	 * @param obj
	 */
	isPromise(obj: unknown): obj is Promise<unknown>;

	/**
	 * Returns true if the specified value is looks like a promise
	 * @param obj
	 */
	isPromiseLike(obj: unknown): obj is PromiseLike<unknown>;

	/**
	 * Returns true if the specified value is a map
	 * @param obj
	 */
	isMap(obj: unknown): obj is Map<unknown, unknown>;

	/**
	 * Returns true if the specified value is a weak map
	 * @param obj
	 */
	isWeakMap(obj: unknown): obj is WeakMap<object, unknown>;

	/**
	 * Returns true if the specified value is a set
	 * @param obj
	 */
	isSet(obj: unknown): obj is Set<unknown>;

	/**
	 * Returns true if the specified value is a weak set
	 * @param obj
	 */
	isWeakSet(obj: unknown): obj is WeakSet<object>;
}

interface ArrayConstructor {
	/**
	 * Returns a curried version of Array.union
	 * @param arr
	 */
	union<T extends Nullable<unknown[]>>(arr: T): <A extends Iterable<unknown> | unknown>(...args: A[]) =>
		Optional<T, Array<IterableType<T> | A extends Iterable<infer V> ? V : NonNullable<A>>>;

	/**
	 * Returns a new array containing elements from all specified iterable values with duplicates removed.
	 * You can also pass non-iterable values and they will be added to the final array,
	 * except values with null and undefined. If the first parameter of the function is equal to null or undefined,
	 * the function returns undefined.
	 *
	 * @param arr
	 * @param args
	 */
	union<T extends Nullable<unknown[]>, A extends Iterable<unknown> | unknown>(
		arr: T,
		...args: A[]
	): Optional<T, Array<IterableType<T> | A extends Iterable<infer V> ? V : NonNullable<A>>>;

	/**
	 * Returns a curried version of Array.concat
	 * @param arr
	 */
	concat<T extends Nullable<unknown[]>>(arr: T): <A extends Iterable<unknown> | unknown>(...args: A[]) =>
		Optional<T, Array<IterableType<T> | A extends Iterable<infer V> ? V : NonNullable<A>>>;

	/**
	 * Returns a new array containing elements from all specified iterable values.
	 * You can also pass non-iterable values and they will be added to the final array,
	 * except values with null and undefined. If the first parameter of the function is equal to null or undefined,
	 * the function returns undefined.
	 *
	 * @param arr
	 * @param args
	 */
	concat<T extends Nullable<unknown[]>, A extends Iterable<unknown> | unknown>(
		arr: T,
		...args: A[]
	): Optional<T, Array<IterableType<T> | A extends Iterable<infer V> ? V : NonNullable<A>>>;
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
		...args: A[]
	): Array<T | A extends Iterable<infer V> ? V : NonNullable<A>>;
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
	 * Returns a function that capitalizes the first character of a value, which it takes, and returns it.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a string.
	 *
	 * @param opts - additional options
	 */
	capitalize(opts: StringCapitalizeOptions): <T>(value: T) => Optional<T, string>;

	/**
	 * Capitalizes the first character of a value and returns it.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a string.
	 *
	 * @param value
	 * @param [opts] - additional options
	 */
	capitalize<T>(value: T, opts?: StringCapitalizeOptions): Optional<T, string>;

	/**
	 * Returns a function that transforms a value that it takes to a CamelCaseStyle version.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a string.
	 *
	 * @param upper - if false, then the first character of a value is transformed to the lower case
	 */
	camelize(upper: boolean): <T>(value: T) => Optional<T, string>;

	/**
	 * Returns a function that transforms a value that it takes to a CamelCaseStyle version.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a string.
	 *
	 * @param opts - additional options
	 */
	camelize(opts: StringCamelizeOptions): <T>(value: T) => Optional<T, string>;

	/**
	 * Returns a CamelCaseStyle version of the specified value.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a string.
	 *
	 * @param value
	 * @param [upper] - if false, then the first character of a value is transformed to the lower case
	 */
	camelize<T>(value: T, upper?: boolean): Optional<T, string>;

	/**
	 * Returns a CamelCaseStyle version of the specified value.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a string.
	 *
	 * @param value
	 * @param [opts] - additional options
	 */
	camelize<T>(value: T, opts?: StringCamelizeOptions): Optional<T, string>;

	/**
	 * Returns a function that transforms a value that it takes to a dash-style version.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a string.
	 *
	 * @param stable - if true, then the operation can be reverted
	 */
	dasherize(stable: boolean): <T>(value: T) => Optional<T, string>;

	/**
	 * Returns a function that transforms a value that it takes to a dash-style version.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a string.
	 *
	 * @param opts - additional options
	 */
	dasherize(opts: StringDasherizeOptions): <T>(value: T) => Optional<T, string>;

	/**
	 * Returns a dash-style version of the specified value.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a string.
	 *
	 * @param value
	 * @param [stable] - if true, then the operation can be reverted
	 */
	dasherize<T>(value: T, stable?: boolean): Optional<T, string>;

	/**
	 * Returns a dash-style version of the specified value.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a string.
	 *
	 * @param value
	 * @param [opts] - additional options
	 */
	dasherize<T>(value: T, opts?: StringDasherizeOptions): Optional<T, string>;

	/**
	 * Returns a function that transforms a value that it takes to a underscore_style version.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a string.
	 *
	 * @param stable - if true, then the operation can be reverted
	 */
	underscore(stable: boolean): <T>(value: T) => Optional<T, string>;

	/**
	 * Returns a function that transforms a value that it takes to a underscore_style version.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a string.
	 *
	 * @param opts - additional options
	 */
	underscore(opts: StringUnderscoreOptions): <T>(value: T) => Optional<T, string>;

	/**
	 * Returns an underscore_style version of the specified value.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a string.
	 *
	 * @param value
	 * @param [stable] - if true, then the operation can be reverted
	 */
	underscore<T>(value: unknown, stable?: boolean): Optional<T, string>;

	/**
	 * Returns an underscore_style version of the specified value.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a string.
	 *
	 * @param value
	 * @param [opts] - additional options
	 */
	underscore<T>(value: unknown, opts?: StringUnderscoreOptions): Optional<T, string>;
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
	 * @param obj
	 */
	isInteger(obj: unknown): boolean;

	/**
	 * Returns true if the specified value is a float number
	 * @param obj
	 */
	isFloat(obj: unknown): boolean;

	/**
	 * Returns true if the specified value is an even number
	 * @param obj
	 */
	isEven(obj: unknown): boolean;

	/**
	 * Returns true if the specified value is an odd number
	 * @param obj
	 */
	isOdd(obj: unknown): boolean;

	/**
	 * Returns true if the specified value is a natural number
	 * @param obj
	 */
	isNatural(obj: unknown): boolean;

	/**
	 * Returns true if the specified value is a positive number
	 * @param obj
	 */
	isPositive(obj: unknown): boolean;

	/**
	 * Returns true if the specified value is a negative number
	 * @param obj
	 */
	isNegative(obj: unknown): boolean;

	/**
	 * Returns true if the specified value is a non-negative number
	 * @param obj
	 */
	isNonNegative(obj: unknown): boolean;

	/**
	 * Returns true if the specified value is a number and is more or equal than 0 and less or equal than 1
	 * @param obj
	 */
	isBetweenZeroAndOne(obj: unknown): boolean;

	/**
	 * Returns true if the specified value is a number and is more than 0 and less or equal than 1
	 * @param obj
	 */
	isPositiveBetweenZeroAndOne(obj: unknown): boolean;

	/**
	 * Returns a value of milliseconds from the seconds.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a number.
	 */
	seconds<T>(value: T): Optional<T, number>;

	/**
	 * Returns a value of milliseconds from the minutes.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a number.
	 */
	minutes<T>(value: T): Optional<T, number>;

	/**
	 * Returns a value of milliseconds from the hours.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a number.
	 */
	hours<T>(value: T): Optional<T, number>;

	/**
	 * Returns a value of milliseconds from the days.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a number.
	 */
	days<T>(value: T): Optional<T, number>;

	/**
	 * Returns a value of milliseconds from the weeks.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a number.
	 */
	weeks<T>(value: T): Optional<T, number>;

	/**
	 * Returns a curried version of Number.floor
	 * @param precision
	 */
	floor(precision: number): <T>(value: T) => Optional<T, number>;

	/**
	 * Shortcut for Math.floor that also allows a precision.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a number.
	 *
	 * @param value
	 * @param precision
	 */
	floor<T>(value: T, precision: number): Optional<T, number>;

	/**
	 * Returns a curried version of Number.round
	 * @param precision
	 */
	round(precision: number): <T>(value: T) => Optional<T, number>;

	/**
	 * Shortcut for Math.round that also allows a precision.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a number.
	 *
	 * @param value
	 * @param precision
	 */
	round<T>(value: unknown, precision: number): Optional<T, number>;

	/**
	 * Returns a curried version of Number.ceil
	 * @param precision
	 */
	ceil(precision: number): <T>(value: T) => Optional<T, number>;

	/**
	 * Shortcut for Math.ceil that also allows a precision.
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a number.
	 *
	 * @param value
	 * @param precision
	 */
	ceil<T>(value: unknown, precision: number): Optional<T, number>;
}

interface NumberPadOptions {
	/**
	 * If true, then a sign of the number is written anyway
	 * @default `false`
	 */
	base?: number;

	/**
	 * Value of the base to convert in a string
	 * @default `10`
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
	 *
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
	format(pattern: string, locale?: CanArray<string>): string;

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
	format(length?: number): string;

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
	 * @param start - date of the beginning
	 * @param end - date of the ending
	 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 */
	isBetween(start: DateCreateValue, end: DateCreateValue, margin?: number): boolean;

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
	 * Returns a new function that allows to invoke the specified function only once.
	 * If the value is equal to null or undefined, the function returns undefined.
	 *
	 * @param fn
	 */
	once<T extends Nullable<AnyFunction>>(fn: T): Optional<T>;

	/**
	 * Returns a new function that allows to invoke a function, which it takes, only with the specified delay.
	 * The next invocation of the function will cancel the previous.
	 *
	 * If the value is equal to null or undefined, the function returns undefined,
	 * otherwise, the value will be converted to a number.
	 *
	 * @param delay
	 */
	debounce(delay: number): <T extends Nullable<AnyFunction>>(fn: T) => Optional<T, AnyFunction<Parameters<T>, void>>;

	/**
	 * Returns a new function that allows to invoke a function only with the specified delay.
	 * The next invocation of the function will cancel the previous.
	 * If the value is equal to null or undefined, the function returns undefined.
	 *
	 * @param fn
	 * @param [delay]
	 */
	debounce<T extends Nullable<AnyFunction>>(fn: T, delay?: number): Optional<T, AnyFunction<Parameters<T>, void>>;

	/**
	 * Returns a new function that allows to to invoke a function, which it takes, not more often than the specified delay.
	 * If the value is equal to null or undefined, the function returns undefined.
	 *
	 * @param delay
	 */
	throttle(delay: number): <T extends Nullable<AnyFunction>>(fn: T) => Optional<T, AnyFunction<Parameters<T>, void>>;

	/**
	 * Returns a new function that allows to invoke the target function not more often than the specified delay.
	 * If the value is equal to null or undefined, the function returns undefined.
	 *
	 * @param fn
	 * @param [delay]
	 */
	throttle<T extends Nullable<AnyFunction>>(fn: T, delay?: number): Optional<T, AnyFunction<Parameters<T>, void>>;
}

interface Function {
	name: string;

	/**
	 * Returns a new function that allows to invoke the target function only once
	 */
	once<T extends AnyFunction>(this: T): T;

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
}
