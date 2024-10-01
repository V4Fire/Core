/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/async/timers/README.md]]
 * @packageDocumentation
 */
import SyncPromise from '../../../core/promise/sync';
import Super from '../../../core/async/timers/callbacks';
import type { AsyncOptions, AsyncIdleOptions, AsyncAnimationFrameOptions, AsyncWaitOptions } from '../../../core/async/interface';
export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
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
     * Returns a promise that will be resolved on the next animation frame request
     * @param [elem] - a link for the DOM element
     */
    animationFrame(elem?: Element): SyncPromise<number>;
    /**
     * Returns a promise that will be resolved on the next animation frame request
     * @param opts - options for the operation
     */
    animationFrame(opts: AsyncAnimationFrameOptions): SyncPromise<number>;
    /**
     * Returns a promise that will be resolved only when the specified function returns a positive value (== true)
     *
     * @param fn
     * @param [opts] - additional options for the operation
     */
    wait(fn: Function, opts?: AsyncWaitOptions): Promise<boolean>;
}
