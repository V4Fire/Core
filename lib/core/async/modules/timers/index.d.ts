/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import Super, { AsyncOptions, AsyncCbOptions, ClearOptionsId } from '../../../../core/async/modules/proxy';
import type { TimerId, IdleCb, AsyncWaitOptions, AsyncIdleOptions, AsyncRequestIdleCallbackOptions } from '../../../../core/async/interface';
export * from '../../../../core/async/modules/proxy';
export * from '../../../../core/async/interface';
export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
    /**
     * Wrapper for `globalThis.setImmediate`
     *
     * @param cb - callback function
     * @param [opts] - additional options for the operation
     */
    setImmediate(cb: Function, opts?: AsyncCbOptions<CTX>): Nullable<TimerId>;
    /**
     * Wrapper for `globalThis.clearImmediate`
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    clearImmediate(id?: TimerId): this;
    /**
     * Clears the specified "setImmediate" timer or a group of timers
     * @param opts - options for the operation
     */
    clearImmediate(opts: ClearOptionsId<TimerId>): this;
    /**
     * Mutes the specified "setImmediate" timer
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    muteImmediate(id?: TimerId): this;
    /**
     * Mutes the specified "setImmediate" timer or a group of timers
     * @param opts - options for the operation
     */
    muteImmediate(opts: ClearOptionsId<TimerId>): this;
    /**
     * Unmutes the specified "setImmediate" timer
     * @param [id] - operation id (if not defined will be got all handlers)
     */
    unmuteImmediate(id?: TimerId): this;
    /**
     * Unmutes the specified "setImmediate" timer or a group of timers
     *
     * @param opts - options for the operation
     */
    unmuteImmediate(opts: ClearOptionsId<TimerId>): this;
    /**
     * Suspends the specified "setImmediate" timer
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    suspendImmediate(id?: TimerId): this;
    /**
     * Suspends the specified "setImmediate" timer or a group of timers
     * @param opts - options for the operation
     */
    suspendImmediate(opts: ClearOptionsId<TimerId>): this;
    /**
     * Unsuspends the specified "setImmediate" timer
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    unsuspendImmediate(id?: TimerId): this;
    /**
     * Unsuspends the specified "setImmediate" timer or a group of timers
     * @param opts - options for the operation
     */
    unsuspendImmediate(opts: ClearOptionsId<TimerId>): this;
    /**
     * Wrapper for `globalThis.setInterval`
     *
     * @param cb - callback function
     * @param timeout - timer value
     * @param [opts] - additional options for the operation
     */
    setInterval(cb: Function, timeout: number, opts?: AsyncCbOptions<CTX>): Nullable<TimerId>;
    /**
     * Wrapper for `globalThis.clearInterval`
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    clearInterval(id?: TimerId): this;
    /**
     * Clears the specified "setInterval" timer or a group of timers
     * @param opts - options for the operation
     */
    clearInterval(opts: ClearOptionsId<TimerId>): this;
    /**
     * Mutes the specified "setInterval" timer
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    muteInterval(id?: TimerId): this;
    /**
     * Mutes the specified "setInterval" timer or a group of timers
     * @param opts - options for the operation
     */
    muteInterval(opts: ClearOptionsId<TimerId>): this;
    /**
     * Unmutes the specified "setInterval" timer
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    unmuteInterval(id?: TimerId): this;
    /**
     * Unmutes the specified "setInterval" timer or a group of timers
     * @param opts - options for the operation
     */
    unmuteInterval(opts: ClearOptionsId<TimerId>): this;
    /**
     * Suspends the specified "setInterval" timer
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    suspendInterval(id?: TimerId): this;
    /**
     * Suspends the specified "setInterval" timer or a group of timers
     * @param opts - options for the operation
     */
    suspendInterval(opts: ClearOptionsId<TimerId>): this;
    /**
     * Unsuspends the specified "setImmediate" timer
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    unsuspendInterval(id?: TimerId): this;
    /**
     * Unsuspends the specified "setImmediate" timer or a group of timers
     * @param opts - options for the operation
     */
    unsuspendInterval(opts: ClearOptionsId<TimerId>): this;
    /**
     * Wrapper for `globalThis.setTimeout`
     *
     * @param cb - callback function
     * @param timeout - timeout value
     * @param [opts] - additional options for the operation
     */
    setTimeout(cb: Function, timeout: number, opts?: AsyncCbOptions<CTX>): Nullable<TimerId>;
    /**
     * Wrapper for `globalThis.clearTimeout`
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    clearTimeout(id?: TimerId): this;
    /**
     * Clears the specified "setTimeout" timer or a group of timers
     * @param opts - options for the operation
     */
    clearTimeout(opts: ClearOptionsId<TimerId>): this;
    /**
     * Mutes the specified "setTimeout" timer
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    muteTimeout(id?: TimerId): this;
    /**
     * Mutes the specified "setTimeout" timer or a group of timers
     * @param opts - options for the operation
     */
    muteTimeout(opts: ClearOptionsId<TimerId>): this;
    /**
     * Unmutes the specified "setTimeout" timer
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    unmuteTimeout(id?: TimerId): this;
    /**
     * Unmutes the specified "setTimeout" timer or a group of timers
     * @param opts - options for the operation
     */
    unmuteTimeout(opts: ClearOptionsId<TimerId>): this;
    /**
     * Suspends the specified "setTimeout" timer
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    suspendTimeout(id?: TimerId): this;
    /**
     * Suspends the specified "setTimeout" timer or a group of timers
     * @param opts - options for the operation
     */
    suspendTimeout(opts: ClearOptionsId<TimerId>): this;
    /**
     * Unsuspends the specified "setTimeout" timer
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    unsuspendTimeout(id?: TimerId): this;
    /**
     * Unsuspends the specified "setTimeout" timer or a group of names
     * @param opts - options for the operation
     */
    unsuspendTimeout(opts: ClearOptionsId<TimerId>): this;
    /**
     * Wrapper for `globalThis.requestIdleCallback`
     *
     * @param cb - callback function
     * @param [opts] - additional options for the operation
     */
    requestIdleCallback<R = unknown>(cb: IdleCb<R, CTX>, opts?: AsyncRequestIdleCallbackOptions<CTX>): Nullable<TimerId>;
    /**
     * Wrapper for `globalThis.cancelIdleCallback`
     *
     * @alias
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    cancelIdleCallback(id?: TimerId): this;
    /**
     * Clears the specified "requestIdleCallback" timer or a group of timers
     *
     * @alias
     * @param opts - options for the operation
     */
    cancelIdleCallback(opts: ClearOptionsId<TimerId>): this;
    /**
     * Wrapper for `globalThis.cancelIdleCallback`
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    clearIdleCallback(id?: TimerId): this;
    /**
     * Clears the specified "requestIdleCallback" timer or a group of timers
     * @param opts - options for the operation
     */
    clearIdleCallback(opts: ClearOptionsId<TimerId>): this;
    /**
     * Mutes the specified "requestIdleCallback" timer
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    muteIdleCallback(id?: TimerId): this;
    /**
     * Mutes the specified "requestIdleCallback" timer or a group of timers
     * @param opts - options for the operation
     */
    muteIdleCallback(opts: ClearOptionsId<TimerId>): this;
    /**
     * Unmutes the specified "requestIdleCallback" timer
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    unmuteIdleCallback(id?: TimerId): this;
    /**
     * Unmutes the specified "requestIdleCallback" timer or a group of timers
     * @param opts - options for the operation
     */
    unmuteIdleCallback(opts: ClearOptionsId<TimerId>): this;
    /**
     * Suspends the specified "requestIdleCallback" timer
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    suspendIdleCallback(id?: TimerId): this;
    /**
     * Suspends the specified "requestIdleCallback" timer or a group of timers
     * @param opts - options for the operation
     */
    suspendIdleCallback(opts: ClearOptionsId<TimerId>): this;
    /**
     * Unsuspends the specified "requestIdleCallback" timer
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    unsuspendIdleCallback(id?: TimerId): this;
    /**
     * Unsuspends the specified "requestIdleCallback" timer or a group of timers
     * @param opts - options for the operation
     */
    unsuspendIdleCallback(opts: ClearOptionsId<TimerId>): this;
    /**
     * Returns a promise that will be resolved after the specified timeout
     *
     * @param timeout
     * @param [opts] - additional options for the operation
     */
    sleep(timeout: number, opts?: AsyncOptions): Promise<void>;
    /**
     * Returns a promise that will be resolved on the next tick of the event loop
     * @param [opts] - additional options for the operation
     */
    nextTick(opts?: AsyncOptions): Promise<void>;
    /**
     * Returns a promise that will be resolved on the process idle
     * @param [opts] - additional options for the operation
     */
    idle(opts?: AsyncIdleOptions): Promise<IdleDeadline>;
    /**
     * Returns a promise that will be resolved only when the specified function returns a positive value (== true)
     *
     * @param fn
     * @param [opts] - additional options for the operation
     */
    wait(fn: Function, opts?: AsyncWaitOptions): Promise<boolean>;
}
