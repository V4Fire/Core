/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import Super from '../../../core/async/timers/timers';
import type { TimerId, IdleCb, ClearOptionsId, AnimationFrameCb, AsyncRequestIdleCallbackOptions, AsyncRequestAnimationFrameOptions } from '../../../core/async/interface';
export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
    /**
     * A wrapper for `globalThis.requestIdleCallback`
     *
     * @param cb - the callback function
     * @param [opts] - additional options for the operation
     */
    requestIdleCallback<R = unknown>(cb: IdleCb<R, CTX>, opts?: AsyncRequestIdleCallbackOptions<CTX>): Nullable<TimerId>;
    /**
     * A wrapper for `globalThis.cancelIdleCallback`
     *
     * @alias
     * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
     */
    cancelIdleCallback(id?: TimerId): this;
    /**
     * Clears the specified `requestIdleCallback` timer or a group of timers
     *
     * @alias
     * @param opts - options for the operation
     */
    cancelIdleCallback(opts: ClearOptionsId<TimerId>): this;
    /**
     * A wrapper for `globalThis.cancelIdleCallback`
     * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
     */
    clearIdleCallback(id?: TimerId): this;
    /**
     * Clears the specified `requestIdleCallback` timer or a group of timers
     * @param opts - options for the operation
     */
    clearIdleCallback(opts: ClearOptionsId<TimerId>): this;
    /**
     * Mutes the specified `requestIdleCallback` timer
     * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
     */
    muteIdleCallback(id?: TimerId): this;
    /**
     * Mutes the specified `requestIdleCallback` timer or a group of timers
     * @param opts - options for the operation
     */
    muteIdleCallback(opts: ClearOptionsId<TimerId>): this;
    /**
     * Unmutes the specified `requestIdleCallback` timer
     * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
     */
    unmuteIdleCallback(id?: TimerId): this;
    /**
     * Unmutes the specified `requestIdleCallback` timer or a group of timers
     * @param opts - options for the operation
     */
    unmuteIdleCallback(opts: ClearOptionsId<TimerId>): this;
    /**
     * Suspends the specified `requestIdleCallback` timer
     * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
     */
    suspendIdleCallback(id?: TimerId): this;
    /**
     * Suspends the specified `requestIdleCallback` timer or a group of timers
     * @param opts - options for the operation
     */
    suspendIdleCallback(opts: ClearOptionsId<TimerId>): this;
    /**
     * Unsuspends the specified `requestIdleCallback` timer
     * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
     */
    unsuspendIdleCallback(id?: TimerId): this;
    /**
     * Unsuspends the specified `requestIdleCallback` timer or a group of timers
     * @param opts - options for the operation
     */
    unsuspendIdleCallback(opts: ClearOptionsId<TimerId>): this;
    /**
     * A wrapper for `globalThis.requestAnimationFrame`
     *
     * @param cb - the callback function
     * @param [elem] - a link for the DOM element
     */
    requestAnimationFrame<T = unknown>(cb: AnimationFrameCb<T, CTX>, elem?: Element): Nullable<number>;
    /**
     * A wrapper for `globalThis.requestAnimationFrame`
     *
     * @param cb - the callback function
     * @param opts - additional options for the operation
     */
    requestAnimationFrame<T = unknown>(cb: AnimationFrameCb<T, CTX>, opts: AsyncRequestAnimationFrameOptions<CTX>): Nullable<number>;
    /**
     * A wrapper for `globalThis.cancelAnimationFrame`
     *
     * @alias
     * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
     */
    cancelAnimationFrame(id?: number): this;
    /**
     * Clears the specified `requestAnimationFrame` timer or a group of timers
     * @param opts - options for the operation
     */
    cancelAnimationFrame(opts: ClearOptionsId<number>): this;
    /**
     * A wrapper for `globalThis.cancelAnimationFrame`
     * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
     */
    clearAnimationFrame(id?: number): this;
    /**
     * Clears the specified `requestAnimationFrame` timer or a group of timers
     * @param opts - options for the operation
     */
    clearAnimationFrame(opts: ClearOptionsId<number>): this;
    /**
     * Mutes the specified `requestAnimationFrame` timer
     * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
     */
    muteAnimationFrame(id?: number): this;
    /**
     * Mutes the specified `requestAnimationFrame` timer or a group of timers
     * @param opts - options for the operation
     */
    muteAnimationFrame(opts: ClearOptionsId<number>): this;
    /**
     * Unmutes the specified `requestAnimationFrame` timer
     * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
     */
    unmuteAnimationFrame(id?: number): this;
    /**
     * Unmutes the specified `requestAnimationFrame` timer or a group of timers
     * @param opts - options for the operation
     */
    unmuteAnimationFrame(opts: ClearOptionsId<number>): this;
    /**
     * Suspends the specified `requestAnimationFrame` timer
     * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
     */
    suspendAnimationFrame(id?: number): this;
    /**
     * Suspends the specified `requestAnimationFrame` timer or a group of timers
     * @param opts - options for the operation
     */
    suspendAnimationFrame(opts: ClearOptionsId<number>): this;
    /**
     * Unsuspends the specified `requestAnimationFrame` timer
     * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
     */
    unsuspendAnimationFrame(id?: number): this;
    /**
     * Unsuspends the specified `requestAnimationFrame` timer or a group of timers
     * @param opts - options for the operation
     */
    unsuspendAnimationFrame(opts: ClearOptionsId<number>): this;
}
