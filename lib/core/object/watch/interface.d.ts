/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
export declare type WatchPath = ObjectPropertyPath;
export declare type WatchDependencies = WatchPath[] | Dictionary<WatchPath[]> | Map<WatchPath, CanArray<WatchPath>>;
export interface Watcher<T extends object = object> {
    /**
     * A proxy object to watch
     */
    proxy: T;
    /**
     * Sets a new watchable value for the proxy object by the specified path
     *
     * @param path
     * @param value
     */
    set(path: WatchPath, value: unknown): void;
    /**
     * Deletes a watchable value from the proxy object by the specified path.
     * To restore watching for this property, use `set`.
     *
     * @param path
     */
    delete(path: WatchPath): void;
    /**
     * Cancels watching for the proxy object
     */
    unwatch(): void;
}
export interface PathModifier {
    (path: unknown[]): unknown[];
}
export interface WatchOptions {
    /**
     * If true, then the callback of changing is also fired on mutations of nested properties
     *
     * @default `false`
     * @example
     * ```js
     * const {proxy} = watch({a: {b: {c: 1}}}, {deep: true}, (mutations) => {
     *   mutations.forEach(([value, oldValue, info]) => {
     *     console.log(value, oldValue, info.path);
     *   });
     * });
     *
     * // 2 1 ['a', 'b', 'c']
     * proxy.a.b.c = 2;
     *
     * // {c: 2} {e: 2} ['a', 'b']
     * proxy.a.b = {e: 2};
     * ```
     */
    deep?: boolean;
    /**
     * If true, then the callback of changing is also fired on mutations of properties from prototypes
     *
     * @default `false`
     * @example
     * ```js
     * const {proxy} = watch(a: 1, {__proto__: {b: 1}}, {withProto: true}, (mutations) => {
     *   mutations.forEach(([value, oldValue, info]) => {
     *     console.log(value, oldValue, info.path, info.fromProto);
     *   });
     * });
     *
     * // 2 1 ['a'] false
     * proxy.a = 2;
     *
     * // 2 1 ['b'] true
     * proxy.b = 2;
     * ```
     */
    withProto?: boolean;
    /**
     * If true, then all mutation events will be fired immediately.
     * Notice, with enabling this option, the callback changes its interface:
     *
     * ```typescript
     * // Before
     * type Cb = (mutations: [[unknown, unknown, WatchHandlerParams]]) => any;
     *
     * // After
     * type CbWithImmediate = (newValue: unknown, oldValue: unknown, info: WatchHandlerParams) => any;
     * ```
     *
     * @default `false`
     * @example
     * ```js
     * const {proxy} = watch(a: 1}, {immediate: true}, (value, oldValue, info) => {
     *   console.log(value, oldValue, info.path);
     * });
     *
     * // 2 1 ['a']
     * proxy.a = 2;
     * ```
     */
    immediate?: boolean;
    /**
     * The option enables or disables collapsing of mutation events.
     * When it toggles to `true`, all mutation events fire as if they occur on top properties of the watchable object.
     *
     * ```js
     * const {proxy} = watch({a: {b: {c: 1}}}, {collapse: true, deep: true}, (mutations) => {
     *   mutations.forEach(([value, oldValue, info]) => {
     *     console.log(value, oldValue, info.path);
     *   });
     * });
     *
     * // {b: {c: 2}} {b: {c: 2}} ['a', 'b', 'c']
     * proxy.a.b.c = 2;
     * ```
     *
     * When it toggles to `false,` and the watcher binds to the specified path, the callback takes a list of mutations.
     * Otherwise, the callback takes only the last mutation.
     *
     * ```js
     * const {proxy} = watch({a: {b: {c: 1}}}, 'a.b', {collapse: false}, (mutations) => {
     *   mutations.forEach(([value, oldValue, info]) => {
     *     console.log(value, oldValue, info.path, info.originalPath);
     *   });
     * });
     *
     * // 2 1 ['a', 'b'] ['a', 'b', 'c']
     * proxy.a.b.c = 2;
     *
     * const {proxy: proxy2} = watch({a: {b: {c: 1}}}, 'a.b', (value, oldValue, info) => {
     *   console.log(value, oldValue, info.path, info.originalPath);
     * });
     *
     * // {c: 2} {c: 2} ['a', 'b'] ['a', 'b', 'c']
     * proxy2.a.b.c = 2;
     * ```
     *
     * @default `false`
     */
    collapse?: boolean;
    /**
     * A function that takes a path of the mutation event and returns a new path.
     * The function is used when you want to mask one mutation to another one.
     *
     * @example
     * ```js
     * function pathModifier(path) {
     *   return path.map((chunk) => chunk.replace(/^_/, ''));
     * }
     *
     * const {proxy} = watch({a: 1, b: 2, _a: 1}, 'a', {pathModifier}, (mutations) => {
     *   mutations.forEach(([value, oldValue, info]) => {
     *     console.log(value, oldValue, info.path, info.originalPath);
     *   });
     * });
     *
     * // 2 1 ['a'], ['_a']
     * proxy._a = 2;
     * ```
     */
    pathModifier?: PathModifier;
    /**
     * A filter function for mutation events.
     * The function allows skipping some mutation events.
     *
     * @example
     * ```js
     * function eventFilter(value, oldValue, info) {
     *   return info.path[0] !== '_a';
     * }
     *
     * const {proxy} = watch({a: 1, b: 2, _a: 1}, {eventFilter}, (mutations) => {
     *   mutations.forEach(([value, oldValue, info]) => {
     *     console.log(value, oldValue, info.path, info.originalPath);
     *   });
     * });
     *
     * // This mutation won't invoke our callback
     * proxy._a = 2;
     * ```
     */
    eventFilter?: WatchHandler;
    /**
     * Link to an object that should connect with the watched object, i.e.,
     * changing of properties of the tied object, will also emit mutation events
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
     * List of prefixes for paths to watch.
     * This parameter can help to watch accessors.
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
     * const {proxy} = watch(obj, 'foo', {prefixes: ['_']}, (value, oldValue, info) => {
     *   console.log(value, oldValue, info.path, info.originalPath, info.parent);
     * });
     *
     * // This mutation will invoke our callback
     * proxy._foo++;
     * ```
     */
    prefixes?: string[];
    /**
     * List of postfixes for paths to watch.
     * This parameter can help to watch accessors.
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
     * const {proxy} = watch(obj, 'foo', {postfixes: ['Store']}, (value, oldValue, info) => {
     *   console.log(value, oldValue, info.path, info.originalPath, info.parent);
     * });
     *
     * // This mutation will invoke our callback
     * proxy.fooStore++;
     * ```
     */
    postfixes?: string[];
    /**
     * When providing the specific path to watch, this parameter can contain a list of dependencies for the watching path.
     * This parameter can help to watch accessors.
     *
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
     * const {proxy} = watch(obj, 'foo', {dependencies: ['bla', 'baz']}, (value, oldValue, info) => {
     *   console.log(value, oldValue, info.path, info.originalPath, info.parent);
     * });
     *
     * // This mutation will invoke our callback
     * proxy.bla++;
     * ```
     *
     * When providing the specific path to watch, this parameter can contain an object or `Map` with lists of
     * dependencies to watch.
     *
     * ```js
     * const obj = {
     *   foo: {
     *     get value() {
     *       return this.bla * this.baz;
     *     }
     *   },
     *
     *   bla: 2,
     *   baz: 3
     * };
     *
     * const depsAsObj = {
     *   'foo.value': ['bla', 'baz']
     * };
     *
     * const {proxy: proxy1} = watch(obj, {dependencies: depsAsObj}, (mutations) => {
     *   mutations.forEach(([value, oldValue, info]) => {
     *     console.log(value, oldValue, info.path, info.originalPath, info.parent);
     *   });
     * });
     *
     * // This mutation will fire an additional event for `foo.value`
     * proxy1.bla++;
     *
     * const depsAsMap = new Map([
     *   [
     *     // A path to the property with dependencies
     *     ['foo', 'value'],
     *
     *     // Dependencies
     *     ['bla', 'baz']
     *   ]
     * ]);
     *
     * const {proxy: proxy2} = watch(obj, {dependencies: depsAsMap}, (mutations) => {
     *   mutations.forEach(([value, oldValue, info]) => {
     *     console.log(value, oldValue, info.path, info.originalPath, info.parent);
     *   });
     * });
     *
     * proxy2.baz++;
     * ```
     */
    dependencies?: WatchDependencies;
    /**
     * Watch engine to use.
     * By default, will be used proxy if supported, otherwise accessors.
     */
    engine?: WatchEngine;
}
export interface WatchEngine {
    watch<T extends object>(obj: T, path: CanUndef<unknown[]>, handler: Nullable<RawWatchHandler>, handlers: WatchHandlersSet, opts?: WatchOptions): Watcher<T>;
    watch<T extends object>(obj: T, path: CanUndef<unknown[]>, handler: Nullable<RawWatchHandler>, handlers: WatchHandlersSet, opts: CanUndef<InternalWatchOptions>, root: object, top: object): T;
    set(obj: object, path: WatchPath, value: unknown, handlers: WatchHandlersSet): void;
    unset(obj: object, path: WatchPath, handlers: WatchHandlersSet): void;
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
     * Link to the object that is watched
     */
    obj: object;
    /**
     * Link to the root object of watching
     */
    root: object;
    /**
     * Link to the top property of watching
     * (the first level property of the root)
     */
    top?: object;
    /**
     * True if the mutation has occurred on a prototype of the watched object
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
     * Information about the parent mutation event
     */
    parent?: WatchHandlerParentParams;
    /**
     * The original path to a property that was changed.
     *
     * @example
     * ```js
     * function pathModifier(path) {
     *   return path.map((chunk) => chunk.replace(/^_/, ''));
     * }
     *
     * const {proxy} = watch(a: 1, b: 2, _a: 1}, 'a', {pathModifier}, (mutations) => {
     *   mutations.forEach(([value, oldValue, info]) => {
     *     console.log(value, oldValue, info.path, info.originalPath);
     *   });
     * });
     *
     * // 2 1 ['a'], ['_a']
     * proxy._a = 2;
     * ```
     */
    originalPath: unknown[];
}
export interface RawWatchHandler<NEW = unknown, OLD = NEW> {
    (newValue: CanUndef<NEW>, oldValue: CanUndef<OLD>, params: RawWatchHandlerParams): void;
}
export interface WatchHandler<NEW = unknown, OLD = NEW> {
    (newValue: CanUndef<NEW>, oldValue: CanUndef<OLD>, params: WatchHandlerParams): void;
}
export interface MultipleWatchHandler<NEW = unknown, OLD = NEW> {
    (mutations: Array<[CanUndef<NEW>, CanUndef<OLD>, WatchHandlerParams]>): void;
}
export declare type WatchHandlersSet = Set<RawWatchHandler>;
