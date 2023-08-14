import type { WatchPath, WatchOptions, WatchHandler, MultipleWatchHandler, Watcher, WatchHandlersSet, WatchEngine } from '../../../core/object/watch/interface';
export * from '../../../core/object/watch/const';
export { unwrap, isProxy, getProxyType } from '../../../core/object/watch/engines/helpers';
export * from '../../../core/object/watch/interface';
export default watch;
/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param [handler] - callback that is invoked on every mutation hook
 */
declare function watch<T extends object>(obj: T, handler?: MultipleWatchHandler): Watcher<T>;
/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param opts - additional options
 * @param [handler] - callback that is invoked on every mutation hook
 */
declare function watch<T extends object>(obj: T, opts: WatchOptions & {
    immediate: true;
}, handler?: WatchHandler): Watcher<T>;
/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param opts - additional options
 * @param [handler] - callback that is invoked on every mutation hook
 */
declare function watch<T extends object>(obj: T, opts: WatchOptions, handler?: MultipleWatchHandler): Watcher<T>;
/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param path - path to a property to watch
 * @param [handler] - callback that is invoked on every mutation hook
 */
declare function watch<T extends object>(obj: T, path: WatchPath, handler?: WatchHandler): Watcher<T>;
/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param path - path to a property to watch
 * @param opts - additional options
 * @param [handler] - callback that is invoked on every mutation hook
 */
declare function watch<T extends object>(obj: T, path: WatchPath, opts: WatchOptions & ({
    collapse: false;
}), handler?: MultipleWatchHandler): Watcher<T>;
/**
 * Watches for changes of the specified object
 *
 * @param obj
 * @param path - path to a property to watch
 * @param opts - additional options
 * @param [handler] - callback that is invoked on every mutation hook
 */
declare function watch<T extends object>(obj: T, path: WatchPath, opts: WatchOptions, handler?: MultipleWatchHandler): Watcher<T>;
/**
 * The function temporarily mutes all mutation events for the specified proxy object
 *
 * @param obj
 * @example
 * ```js
 * const user = {
 *   name: 'Kobezzza',
 *   skills: {
 *     programming: 80,
 *     singing: 10
 *   }
 * };
 *
 * const {proxy} = watch(user, {immediate: true, deep: true}, (value, oldValue, info) => {
 *   console.log(value, oldValue, info.path);
 * });
 *
 * // 81 80 ['skills', 'programming']
 * proxy.skills.programming++;
 * mute(proxy);
 *
 * // This mutation won't invoke our callback
 * proxy.skills.programming++;
 * ```
 */
export declare function mute(obj: object): boolean;
/**
 * Wraps the specified object with unwatchable proxy, i.e. any mutations of this proxy can’t be watched
 *
 * @param obj
 * @example
 * ```js
 * const obj = {
 *   a: 1,
 *   b: unwatchable({c: 2})
 * };
 *
 * const {proxy} = watch(obj, {immediate: true}, (value, oldValue) => {
 *  console.log(value, oldValue);
 * });
 *
 * // This mutation will be ignored by the watcher
 * proxy.b.c = 3;
 *
 * // 1 2
 * proxy.a = 2;
 * ```
 */
export declare function unwatchable<T extends object>(obj: T): T;
/**
 * The function unmutes all mutation events for the specified proxy object
 *
 * @param obj
 * @example
 * ```js
 * const user = {
 *   name: 'Kobezzza',
 *   skills: {
 *     programming: 80,
 *     singing: 10
 *   }
 * };
 *
 * const {proxy} = watch(user, {immediate: true, deep: true}, (value, oldValue, info) => {
 *   console.log(value, oldValue, info.path);
 * });
 *
 * // 81 80 ['skills', 'programming']
 * proxy.skills.programming++;
 * mute(proxy);
 *
 * // This mutation won't invoke our callback
 * proxy.skills.programming++;
 * unmute(proxy);
 *
 * // 83 82 ['skills', 'programming']
 * proxy.skills.programming++;
 * ```
 */
export declare function unmute(obj: object): boolean;
/**
 * Sets a new watchable value for a proxy object by the specified path.
 * The function is actual when using an engine based on accessors to add new properties to the watchable object.
 * Or when you want to restore watching for a property after deleting it.
 *
 * @param obj
 * @param path
 * @param value
 * @param [engine] - watch engine to use
 *
 * @example
 * ```js
 * const user = {
 *   name: 'Kobezzza',
 *   skills: {
 *     programming: 80,
 *     singing: 10
 *   }
 * };
 *
 * const {proxy} = watch(user, {immediate: true, deep: true}, (value, oldValue, info) => {
 *   console.log(value, oldValue, info.path);
 * });
 *
 * // This mutation will invoke our callback
 * set(proxy, 'bla.foo', 1);
 * ```
 */
export declare function set(obj: object, path: WatchPath, value: unknown, engine?: WatchEngine): void;
/**
 * Sets a new watchable value for a proxy object by the specified path.
 * The function is actual when using an engine based on accessors to add new properties to the watchable object.
 * Or when you want to restore watching for a property after deleting it.
 *
 * @param obj
 * @param path
 * @param value
 * @param [handlers] - set of registered handlers
 * @param [engine] - watch engine to use
 */
export declare function set(obj: object, path: WatchPath, value: unknown, handlers: WatchHandlersSet, engine?: WatchEngine): void;
/**
 * Deletes a watchable value from a proxy object by the specified path
 *
 * @param obj
 * @param path
 * @param [engine] - watch engine to use
 *
 * @example
 * ```js
 * const user = {
 *   name: 'Kobezzza',
 *   skills: {
 *     programming: 80,
 *     singing: 10
 *   }
 * };
 *
 * const {proxy} = watch(user, {immediate: true, deep: true}, (value, oldValue, info) => {
 *   console.log(value, oldValue, info.path);
 * });
 *
 * // This mutation will invoke our callback
 * unset(proxy, 'skills.programming');
 *
 * console.log('programming' in proxy.skills === false);
 *
 * // This mutation won't invoke our callback
 * proxy.skills.programming = 80;
 *
 * // Invoke set to register a property to watch.
 * // This mutation will invoke our callback.
 * set(proxy, 'skills.programming', 80)
 *
 * // This mutation will invoke our callback
 * proxy.skills.programming++;
 * ```
 */
export declare function unset(obj: object, path: WatchPath, engine?: WatchEngine): void;
/**
 * Deletes a watchable value from a proxy object by the specified path.
 * To restore watching for this property, use `set`.
 *
 * @param obj
 * @param path
 * @param [handlers] - set of registered handlers
 * @param [engine] - watch engine to use
 */
export declare function unset(obj: object, path: WatchPath, handlers: WatchHandlersSet, engine?: WatchEngine): void;
