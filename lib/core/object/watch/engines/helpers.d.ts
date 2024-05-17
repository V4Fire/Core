/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { WatchHandlersSet, InternalWatchOptions } from '../../../../core/object/watch/interface';
/**
 * Returns true if the specified value is a watch proxy
 * @param value
 */
export declare function isProxy(value: unknown): value is object;
/**
 * Unwraps the specified value to watch and returns the raw object
 * @param value
 */
export declare function unwrap(value: unknown): CanUndef<object>;
/**
 * Returns a type of data to watch or false
 * @param obj
 */
export declare function getProxyType(obj: unknown): Nullable<string>;
/**
 * Returns a value to the proxy from the specified raw value
 *
 * @param rawValue
 * @param key - property key for a value
 * @param path - base path to object properties: it is provided to a watch handler with parameters
 * @param handlers - set of registered handlers
 * @param root - link to the root object of watching
 * @param [top] - link to the top object of watching
 * @param [opts] - additional options
 */
export declare function getProxyValue(rawValue: unknown, key: unknown, path: CanUndef<unknown[]>, handlers: WatchHandlersSet, root: object, top?: object, opts?: InternalWatchOptions): unknown;
/**
 * Returns a value from an object by the specified label and handlers
 *
 * @param obj
 * @param label
 * @param handlers
 */
export declare function getOrCreateLabelValueByHandlers<T = unknown>(obj: object, label: symbol | string, handlers: WatchHandlersSet): CanUndef<T>;
/**
 * Returns a value from an object by the specified label and handlers
 *
 * @param obj
 * @param label
 * @param handlers
 * @param def - default value (can be declared as a function that will be invoked)
 */
export declare function getOrCreateLabelValueByHandlers<T = unknown>(obj: object, label: symbol | string, handlers: WatchHandlersSet, def: unknown): T;
