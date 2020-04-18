/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type WatchPath = ObjectPropertyPath;

export type WatchDependencies =
	WatchPath[] |
	Dictionary<WatchPath[]> |
	Map<WatchPath, CanArray<WatchPath>>;

export interface Watcher<T extends object = object> {
	/**
	 * Proxy object to watch
	 */
	proxy: T;

	/**
	 * Sets a new watchable value for an object by the specified path
	 *
	 * @param path
	 * @param value
	 */
	set(path: WatchPath, value: unknown): void;

	/**
	 * Deletes a watchable value from an object by the specified path
	 * @param path
	 */
	delete(path: WatchPath): void;

	/**
	 * Cancels watching for an object
	 */
	unwatch(): void;
}

export interface PathModifier {
	(path: unknown[]): unknown[];
}

export interface WatchOptions {
	/**
	 * If true, then the callback of changing is also fired on mutation of nested objects
	 * @default `false`
	 */
	deep?: boolean;

	/**
	 * If true, then the callback of changing is also fired on mutation of objects from a prototype
	 * @default `false`
	 */
	withProto?: boolean;

	/**
	 * If true, then all mutation events will be fired immediately
	 * @default `false`
	 */
	immediate?: boolean;

	/**
	 * If true, then all mutation events of nested properties will be collapsed to one event
	 * and fired from a top property of the object
	 *
	 * @default `false`
	 */
	collapse?: boolean;

	/**
	 * Function that takes a path of the mutation event and returns a new path
	 */
	pathModifier?: PathModifier;

	/**
	 * Filter function for mutation events
	 */
	eventFilter?: WatchHandler;

	/**
	 * Link to an object that has connection with the watched object
	 *
	 * @example
	 * ```js
	 * const data = {
	 *   foo: 2
	 * };
	 *
	 * class Bla {
	 *   data = data;
	 *
	 *   constructor() {
	 *     watch(this.data, {tiedWith: this}, (val) => {
	 *       console.log(val);
	 *     });
	 *   }
	 * }
	 *
	 * const bla = new Bla();
	 * bla.foo = 3;
	 * ```
	 */
	tiedWith?: object;

	/**
	 * List of prefixes for a path to watch.
	 * This parameter can help to watch getters.
	 *
	 * @example
	 * ```js
	 * const obj = {
	 *   get foo() {
	 *     return this._foo * 2;
	 *   },
	 *
	 *   _foo: 2
	 * };
	 *
	 * watch(obj, 'foo', {prefixes: ['_']}, (val) => {
	 *   console.log(val);
	 * });
	 * ```
	 */
	prefixes?: string[];

	/**
	 * List of postfixes for a path to watch.
	 * This parameter can help to watch getters.
	 *
	 * @example
	 * ```js
	 * const obj = {
	 *   get foo() {
	 *     return this.fooStore * 2;
	 *   },
	 *
	 *   fooStore: 2
	 * };
	 *
	 * watch(obj, 'foo', {postfixes: ['Store']}, (val) => {
	 *   console.log(val);
	 * });
	 * ```
	 */
	postfixes?: string[];

	/**
	 * List of dependencies for a path to watch.
	 * This parameter can help to watch getters.
	 *
	 * @example
	 * ```js
	 * const obj = {
	 *   get foo() {
	 *     return this.bla * this.baz;
	 *   },
	 *
	 *   bla: 2,
	 *   baz: 3
	 * };
	 *
	 * watch(obj, 'foo', {dependencies: ['bla', 'baz']}, (val) => {
	 *   console.log(val);
	 * });
	 * ```
	 */
	dependencies?: WatchDependencies;
}

export interface InternalWatchOptions extends WatchOptions {
	fromProto?: boolean | 1;
}

export interface WatchHandlerParentParams {
	value: unknown;
	oldValue: unknown;
	info: WatchHandlerParams;
}

/**
 * Parameters of a mutation event
 */
export interface RawWatchHandlerParams {
	/**
	 * Link to an object that is watched
	 */
	obj: object;

	/**
	 * Link to the root object of watching
	 */
	root: object;

	/**
	 * Link to the top object of watching
	 * (the first level property of the root)
	 */
	top?: object;

	/**
	 * True if a mutation has occurred on an object from a prototype of the watched object
	 */
	fromProto: boolean;

	/**
	 * Path to a property that was changed
	 */
	path: unknown[];
}

/**
 * Extended parameters of a mutation event
 */
export interface WatchHandlerParams extends RawWatchHandlerParams {
	/**
	 * Information about a parent mutation event
	 */
	parent?: WatchHandlerParentParams;

	/**
	 * Original path to a property that was changed
	 */
	originalPath: unknown[];
}

export interface RawWatchHandler<NEW = unknown, OLD = NEW> {
	(newValue: CanUndef<NEW>, oldValue: CanUndef<OLD>, params: RawWatchHandlerParams): any;
}

export interface WatchHandler<NEW = unknown, OLD = NEW> extends RawWatchHandler {
	(newValue: CanUndef<NEW>, oldValue: CanUndef<OLD>, params: WatchHandlerParams): any;
}

export interface MultipleWatchHandler<NEW = unknown, OLD = NEW> {
	(mutations: [CanUndef<NEW>, CanUndef<OLD>, WatchHandlerParams][]): any;
}

export type WatchHandlersSet = Set<RawWatchHandler>;
