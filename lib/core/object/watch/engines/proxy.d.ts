/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { Watcher, WatchPath, RawWatchHandler, WatchHandlersSet, WatchOptions, InternalWatchOptions } from '../../../../core/object/watch/interface';
/**
 * Watches for changes of the specified object by using Proxy objects
 *
 * @param obj
 * @param path - base path to object properties: it is provided to a watch handler with parameters
 * @param handler - callback that is invoked on every mutation hook
 * @param handlers - set of registered handlers
 * @param [opts] - additional options
 */
export declare function watch<T extends object>(obj: T, path: CanUndef<unknown[]>, handler: Nullable<RawWatchHandler>, handlers: WatchHandlersSet, opts?: WatchOptions): Watcher<T>;
/**
 * Watches for changes of the specified object by using Proxy objects
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
 * Deletes a watchable value for an object by the specified path
 *
 * @param obj
 * @param path
 * @param handlers - set of registered handlers
 */
export declare function unset(obj: object, path: WatchPath, handlers: WatchHandlersSet): void;
