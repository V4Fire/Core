/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { Watcher, WatchPath, RawWatchHandler, WatchHandlersSet, WatchOptions, InternalWatchOptions } from '../../../../core/object/watch/interface';
/**
 * Watches for changes of the specified object by using accessors
 *
 * @param obj
 * @param path - base path to object properties: it is provided to a watch handler with parameters
 * @param handler - callback that is invoked on every mutation hook
 * @param handlers - set of registered handlers
 * @param [opts] - additional options
 */
export declare function watch<T extends object>(obj: T, path: CanUndef<unknown[]>, handler: Nullable<RawWatchHandler>, handlers: WatchHandlersSet, opts?: WatchOptions): Watcher<T>;
/**
 * Watches for changes of the specified object by using accessors
 *
 * @param obj
 * @param path - base path to object properties: it is provided to a watch handler with parameters
 * @param handler - callback that is invoked on every mutation hook
 * @param handlers - set of registered handlers
 * @param opts - additional options
 * @param root - link to the root object of watching
 * @param top - link to the top object of watching
 */
export declare function watch<T extends object>(obj: T, path: CanUndef<unknown[]>, handler: Nullable<RawWatchHandler>, handlers: WatchHandlersSet, opts: CanUndef<InternalWatchOptions>, root: object, top: object): T;
/**
 * Sets a new watchable value for an object by the specified path
 *
 * @param obj
 * @param path
 * @param value
 * @param handlers - set of registered handlers
 */
export declare function set(obj: object, path: WatchPath, value: unknown, handlers: WatchHandlersSet): void;
/**
 * Unsets a watchable value for an object by the specified path
 *
 * @param obj
 * @param path
 * @param handlers - set of registered handlers
 */
export declare function unset(obj: object, path: WatchPath, handlers: WatchHandlersSet): void;
/**
 * Sets a pair of accessors to watch the specified property and returns a proxy object
 *
 * @param obj - object to watch
 * @param key - property key to watch
 * @param path - path to the object to watch from the root object
 * @param handlers - set of registered handlers
 * @param root - link to the root object of watching
 * @param [top] - link to the top object of watching
 * @param [opts] - additional watch options
 */
export declare function setWatchAccessors(obj: object, key: string, path: CanUndef<unknown[]>, handlers: WatchHandlersSet, root: object, top?: object, opts?: InternalWatchOptions): Dictionary;
