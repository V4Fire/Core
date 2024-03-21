/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { WatchHandlersSet } from '../../../../core/object/watch/interface';
import type { WrapOptions } from '../../../../core/object/watch/wrap/interface';
export * from '../../../../core/object/watch/wrap/interface';
/**
 * Wraps mutation methods of the specified object that they be able to emit events about mutations
 *
 * @param obj
 * @param opts - additional options
 * @param handlers - set of callbacks that are invoked on every mutation hooks
 */
export declare function bindMutationHooks<T extends object>(obj: T, opts: WrapOptions, handlers: WatchHandlersSet): T;
/**
 * Wraps mutation methods of the specified object that they be able to emit events about mutations
 *
 * @param obj
 * @param handlers - set of callbacks that are invoked on every mutation hooks
 */
export declare function bindMutationHooks<T extends object>(obj: T, handlers: WatchHandlersSet): T;
