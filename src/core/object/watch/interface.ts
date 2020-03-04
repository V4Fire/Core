/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type WatchPath = string | unknown[];

export interface Watcher<T = unknown> {
	proxy: T;
	unwatch(): void;
}

export interface WatchOptions {
	/**
	 * If true, then the callback of changing is also fired on mutation of nested objects
	 * @default `false`
	 */
	deep?: boolean;

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
	dependencies?: WatchPath[] | [WatchPath, WatchPath[]];
}

export interface WrapOptions {
	/**
	 * Link a top property of watching
	 */
	top?: object;

	/**
	 * Base path to object properties:
	 * it is provided to a watch handler with parameters
	 */
	path?: unknown[];

	/**
	 * True if an object that is wrapped is the root of watching
	 * @default `false`
	 */
	isRoot?: boolean;
}

/**
 * Parameters of a mutation event
 */
export interface WatchHandlerParams {
	/**
	 * Link to an object that is watched
	 */
	obj: object;

	/**
	 * Link a top property of watching
	 */
	top?: object;

	/**
	 * True if a mutation has occurred on the root object
	 */
	isRoot: boolean;

	/**
	 * Path to a property that was changed
	 */
	path: unknown[];
}

export interface WatchHandler<NEW = unknown, OLD = NEW> {
	(newValue: CanUndef<NEW>, oldValue: CanUndef<OLD>, params: WatchHandlerParams): any;
}

export interface MultipleWatchHandler<NEW = unknown, OLD = NEW> {
	(mutations: [CanUndef<NEW>, CanUndef<OLD>, WatchHandlerParams]): any;
}
