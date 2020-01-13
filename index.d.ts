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

// tslint:disable:max-file-line-count

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

type Wrap<T> = T & any;
type Nullable<T> = T | null | undefined;
type CanPromise<T> = T | Promise<T>;
type CanUndef<T> = T | undefined;
type CanVoid<T> = T | void;
type CanArray<T> = T | T[];

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
	 * JSON.parse reviver or false for disable defaults
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
	 * If true, then descriptors of object properties is copied too
	 * @default `false`
	 */
	withDescriptor?: boolean;

	/**
	 * If true, then accessors (but not all descriptors) of object properties is copied too
	 * @default `false`
	 */
	withAccessors?: boolean;

	/**
	 * If true, then object properties is copied with their prototypes
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

interface ObjectConstructor {
	/**
	 * Returns a value from the object by the specified path
	 *
	 * @param obj
	 * @param path
	 * @param [opts] - additional options
	 */
	get<T = unknown>(obj: unknown, path: string | unknown[], opts?: ObjectGetOptions): T;

	/**
	 * Returns true if the object has a property by the specified path
	 *
	 * @param obj
	 * @param path
	 * @param [opts] - additional options
	 */
	has(obj: object, path: string | unknown[], opts?: ObjectGetOptions): boolean;

	/**
	 * Sets a value to the object by the specified path
	 *
	 * @param obj
	 * @param path
	 * @param value
	 * @param [opts] - additional options
	 */
	set<T = unknown>(obj: unknown, path: string | unknown[], value: T, opts?: ObjectSetOptions): T;

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
	forEach<V = unknown>(
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
	forEach<V = unknown>(
		obj: Dictionary<V>,
		opts?: ObjectForEachOptions & ({notOwn: boolean | -1} | {withDescriptor: false}),
		cb: (el: V, key: string, data: Dictionary<V>) => any
	): void;

	/**
	 * Iterates over the specified array
	 *
	 * @param obj - object to iterate
	 * @param opts - additional options
	 * @param cb - callback function that is called on each of object elements
	 */
	forEach<V = unknown>(
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
	forEach<V = unknown>(
		obj: V[],
		cb: (el: V, i: number, data: V[]) => any,
		opts?: ObjectForEachOptions
	): void;

	/**
	 * Iterates over the specified Set object
	 *
	 * @param obj - object to iterate
	 * @param opts - additional options
	 * @param cb - callback function that is called on each of object elements
	 */
	forEach<V = unknown>(
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
	forEach<V = unknown>(
		obj: Set<V>,
		cb: (el: V, i: V, data: Set<V>) => any,
		opts?: ObjectForEachOptions
	): void;

	/**
	 * Iterates over the specified Map object
	 *
	 * @param obj - object to iterate
	 * @param opts - additional options
	 * @param cb - callback function that is called on each of object elements
	 */
	forEach<V = unknown, K = unknown>(
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
	forEach<V = unknown, K = unknown>(
		obj: Map<K, V>,
		cb: (el: V, key: K, data: Map<K, V>) => any,
		opts?: ObjectForEachOptions
	): void;

	/**
	 * Iterates over the specified iterable object
	 *
	 * @param obj - object to iterate
	 * @param opts - additional options
	 * @param cb - callback function that is called on each of object elements
	 */
	forEach<V = unknown>(
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
	forEach<V = unknown>(
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
	forEach<V = unknown>(
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
	forEach<V = unknown>(
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
	 * Compares two specified objects using naive but fast "JSON.stringify/parse" strategy and returns the result
	 *
	 * @param a
	 * @param b
	 */
	fastCompare<T = unknown>(a: unknown, b: T): a is T;

	/**
	 * Clones the specified object using naive but fast "JSON.stringify/parse" strategy and returns a new object
	 *
	 * @param obj
	 * @param [opts] - additional options
	 */
	fastClone<T = unknown>(obj: T, opts?: FastCloneOptions): T;

	/**
	 * Returns a string representation of the specified object naive but fast "JSON.stringify/parse" strategy
	 * @param obj
	 */
	fastHash(obj: unknown): string;

	/**
	 * Extends the specified object by another objects.
	 * If the base value is not an object, a new object will be created with a type similar to the first extension object.
	 *
	 * @param opts - if true, then properties will be copied recursively OR additional options for extending
	 * @param base - base object
	 * @param obj1 - object for extending
	 */
	mixin<B = unknown, O1 = unknown>(
		opts: ObjectMixinOptions | boolean,
		base?: B,
		obj1: O1
	): B & O1;

	/**
	 * Extends the specified object by another objects.
	 * If the base value is not an object, a new object will be created with a type similar to the first extension object.
	 *
	 * @param opts - if true, then properties will be copied recursively OR additional options for extending
	 * @param base - base object
	 * @param obj1 - object for extending
	 * @param obj2 - object for extending
	 */
	mixin<B = unknown, O1 = unknown, O2 = unknown>(
		opts: ObjectMixinOptions | boolean,
		base?: B,
		obj1: O1,
		obj2: O2
	): B & O1 & O2;

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
	mixin<B = unknown, O1 = unknown, O2 = unknown, O3 = unknown>(
		opts: ObjectMixinOptions | boolean,
		base?: B,
		obj1: O1,
		obj2: O2,
		obj3: O3
	): B & O1 & O2 & O3;

	/**
	 * Extends the specified object by another objects.
	 * If the base value is not an object, a new object will be created with a type similar to the first extension object.
	 *
	 * @param opts - if true, then properties will be copied recursively OR additional options for extending
	 * @param base - base object
	 * @param objects - objects for extending
	 */
	mixin<R = unknown>(
		opts: ObjectMixinOptions | boolean,
		base?: unknown,
		...objects: unknown[]
	): R;

	/**
	 * Parses the specified value as a JSON/JS object and returns the result
	 * @param value
	 */
	parse<V = unknown, R = unknown>(value: V): CanUndef<R>;

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
	 *   all key from these objects is merged to the target
	 *
	 * @example
	 * ```js
	 * Object.createDict({a: 1}, {b: 2}) // {a: 1, b: 2, __proto__: null}
	 * ```
	 */
	createDict<D extends object>(...objects: D[]): Pick<D, keyof D>;

	/**
	 * Takes the enum-like object and converts it to a dictionary:
	 * number values from the object is skipped
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
	fromArray<T = boolean>(arr: unknown[], opts?: ObjectFromArrayOptions<T>): Dictionary<T>;

	/**
	 * Returns a new object based on the specified, but only with fields which match to the specified condition
	 *
	 * @param obj
	 * @param condition - regular expression for filtering
	 */
	select<D extends object>(obj: D, condition: RegExp): {[K in keyof D]?: D[K]};

	/**
	 * Returns a new object based on the specified, but only with fields which match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys (it can be represented as an array or an object)
	 */
	select<D extends object, C extends string>(obj: D, condition: CanArray<C>): Pick<D, Extract<keyof D, C>>;

	/**
	 * Returns a new object based on the specified, but only with fields which match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys (it can be represented as an array or an object) or a regular expression
	 */
	select<D extends object, C extends object>(obj: D, condition: C): Pick<D, Extract<keyof D, keyof C>>;

	/**
	 * Returns a new object based on the specified, but without fields which match to the specified condition
	 *
	 * @param obj
	 * @param condition - regular expression for filtering
	 */
	reject<D extends object>(obj: D, condition: RegExp): {[K in keyof D]?: D[K]};

	/**
	 * Returns a new object based on the specified, but without fields which match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys (it can be represented as an array or an object)
	 */
	reject<D extends object, C extends string>(obj: D, condition: CanArray<C>): Omit<D, C>;

	/**
	 * Returns a new object based on the specified, but without fields which match to the specified condition
	 *
	 * @param obj
	 * @param condition - whitelist of keys (it can be represented as an array or an object) or a regular expression
	 */
	reject<D extends object, C extends object>(obj: D, condition: C): Omit<D, keyof C>;

	/**
	 * Returns true if the specified value is an object
	 * @param obj
	 */
	isObject(obj: unknown): obj is Dictionary;

	/**
	 * Returns true if the specified value is a hash table object
	 * @param obj
	 */
	isSimpleObject(obj: unknown): obj is object;

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
	 * Returns true if the specified value is an iterator
	 * @param obj
	 */
	isIterator(obj: unknown): obj is Iterator;

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

interface Array<T> {
	/**
	 * Returns a new array containing elements from all specified arrays with duplicates removed
	 * @param args
	 */
	union<A extends unknown[]>(...args: A): A extends (infer V)[][] ?
		Array<T | V> : A extends (infer V)[] ? Array<T | V> : T[];
}

interface StringCapitalizeOptions {
	/**
	 * If is true, then remainder of the string will be transformed to lower case
	 * @default `false`
	 */
	lower?: boolean;

	/**
	 * If is true, all words in the string will be capitalized
	 * @default `false`
	 */
	all?: boolean;
}

interface String {
	/**
	 * Capitalizes the first character of a string and returns it
	 * @param [opts] - additional options
	 */
	capitalize(opts?: StringCapitalizeOptions): string;

	/**
	 * Returns a CamelCaseStyle version of the specified string
	 * @param [upper] - if false, then the first character of the string will be transformed to the lower case
	 */
	camelize(upper?: boolean): string;

	/**
	 * Returns a dash-style version of the specified string
	 * @param [stable] - if true, then the operation can be reverted
	 */
	dasherize(stable?: boolean): string;

	/**
	 * Returns an underscore_style version of the specified string
	 * @param [stable] - if true, then the operation can be reverted
	 */
	underscore(stable?: boolean): string;
}

type NumberOption =
	'decimal' |
	'thousands';

interface NumberConstructor {
	/**
	 * Returns an option value by the specified key
	 * @param key
	 */
	getOption(key: NumberOption): string;

	/**
	 * Sets a new option value by the specified key
	 *
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

interface NumberFormatOptions {
	/**
	 * Length of the decimal part
	 */
	decimalLength?: boolean;

	/**
	 * Separator for the decimal part
	 */
	decimal?: string;

	/**
	 * Separator for the "thousand" chunks
	 */
	thousands?: string;
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
	 * Returns a string version of the number with adding some extra formatting
	 * @param [opts] - additional options
	 */
	format(opts?: NumberFormatOptions): string;

	/**
	 * Returns a string version of the number with adding some extra formatting
	 * @param [length] - length of the decimal part
	 */
	// tslint:disable-next-line:unified-signatures
	format(length?: number): string;

	/**
	 * Shortcut for the Math.floor method that also allows a precision
	 * @param [precision]
	 */
	floor(precision?: number): number;

	/**
	 * Shortcut for the Math.round method that also allows a precision
	 * @param [precision]
	 */
	round(precision?: number): number;

	/**
	 * Shortcut for the Math.ceil method that also allows a precision
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
	 *  1. string pattern using the native Date.parse with some polyfills
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

interface DateRelative {
	type: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
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
	short(locale?: string): string;

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
	medium(locale?: string): string;

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
	long(locale?: string): string;

	/**
	 * Returns a string representation of the date by the specified pattern.
	 * All pattern directives is based on native Date Intl options:
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
	 *    '`year:2-digit;month:short'`
	 *
	 * @param [locale] - locale for internalizing
	 *
	 * @example
	 * ```js
	 * new Date('12/28/2019').format('year', 'en-us') // '2019'
	 * new Date('12/28/2019').format('year:2-digit', 'en-us') // '19'
	 * new Date('12/28/2019').format('year:2-digit;month', 'en-us') // 'Dec 19'
	 *
	 * // Formatting a date using short aliases
	 * new Date('12/28/2019').format('Y:2-digit;M:long;d', 'en-us') // 'December 28, 19'
	 * ```
	 */
	format(pattern: string, locale?: string): string;

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

interface Function {
	name: string;

	/**
	 * Returns a new function that allows to invoke the target function only once
	 */
	once(): Function;

	/**
	 * Returns a new function that allows to invoke the target function only with the specified delay.
	 * The next invocation of the function will cancel the previous.
	 *
	 * @param [delay]
	 */
	debounce(delay?: number): Function;

	/**
	 * Returns a new function that allows to invoke the target function not more often than the specified delay
	 * @param [delay]
	 */
	throttle(delay?: number): Function;
}
