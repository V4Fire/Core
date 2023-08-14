/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { EventEmitterLike } from '../../core/async';
/**
 * Returns a promise that will be resolved after emitting of all events from the specified emitter
 *
 * @param emitter
 * @param events - events to listen
 *
 * @example
 * ```js
 * // The promise will be resolved after two window events
 * resolveAfterEvents(window, 'resize', 'scroll').then(() => {
 *   console.log('Boom!');
 * });
 * ```
 */
export declare function resolveAfterEvents(emitter: EventEmitterLike, ...events: string[]): Promise<void>;
/**
 * Wraps a callback into a new function that never calls the target until all specified flags are resolved.
 * The function returns a new function that takes a string flag and resolves it.
 * After all, flags are resolved, the last function invokes the target function.
 * If you try to invoke the function after the first time resolving, ii won't be executed.
 *
 * @param cb - callback function that is invoked after resolving all flags
 * @param flags - flags to resolve
 *
 * @example
 * ```js
 * const semaphore = createsAsyncSemaphore(() => {
 *   console.log('Boom!');
 * }, 'foo', 'bar');
 *
 * semaphore('foo');
 * semaphore('bar'); // 'Boom!'
 *
 * // Function already resolved, the target function isn't executed
 * semaphore();
 * ```
 */
export declare function createsAsyncSemaphore<T>(cb: () => T, ...flags: string[]): (flag: string) => CanUndef<T>;
/**
 * @deprecated
 * @see [[createsAsyncSemaphore]]
 */
export declare const onEverythingReady: import("../../core/functools").WarnedFn<[cb: () => unknown, ...flags: string[]], (flag: string) => void>;
/**
 * @deprecated
 * @see [[resolveAfterEvents]]
 */
export declare const afterEvents: import("../../core/functools").WarnedFn<[emitter: EventEmitterLike, cb: string | Function, ...events: string[]], Promise<void>>;
/**
 * Creates a synchronous promise wrapper for the specified value
 *
 * @deprecated
 * @see [[SyncPromise]]
 * @param resolveValue
 * @param rejectValue
 */
export declare const createSyncPromise: import("../../core/functools").WarnedFn<[resolveValue?: unknown, rejectValue?: unknown], Promise<unknown>>;
