/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import Super, { BoundedCb, AsyncCbOptions, AsyncProxyOptions, ClearProxyOptions } from '../../../core/async/core';
import type { WorkerLikeP, AsyncWorkerOptions } from '../../../core/async/interface';
export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
    /**
     * Wraps the specified worker object.
     * Additionally, if the worker is a function, it will be interpreted as the destructor.
     *
     * This method doesn't attach any hooks or listeners to the object.
     * However, each time the same object is registered, Async will increment the number of links related to this object.
     * Later, when we try to destroy the worker using one of Async's methods, such as `terminateWorker`,
     * it will decrement the link count.
     * When the number of links reaches zero, Async will attempt to call the "real" object destructor
     * using one of the possible destructor methods from the allowlist or the specified destructor name.
     *
     * @param worker
     * @param [opts] - additional options for the operation
     *
     * @example
     * ```js
     * const
     *   async = new Async(),
     *   el = document.createElement('div');
     *
     * $el.appendChild(el);
     *
     * // This function will work as a destructor
     * async.worker(() => el.remove());
     *
     * const myWorker = new Worker('my-worker.js');
     *
     * async.worker(myWorker);
     *
     * async.clearAll();
     * ```
     */
    worker<T extends WorkerLikeP>(worker: T, opts?: AsyncWorkerOptions<CTX>): T;
    /**
     * Terminates the specified worker
     *
     * @alias
     * @param [id] - the worker object to be terminated
     *   (if not specified, the operation will be applied to all registered tasks)
     */
    terminateWorker(id?: WorkerLikeP): this;
    /**
     * Terminates the specified worker or a group of workers
     *
     * @alias
     * @param opts - options for the operation
     */
    terminateWorker(opts: ClearProxyOptions<WorkerLikeP>): this;
    /**
     * Terminates the specified worker
     *
     * @param [id] - the worker object to be terminated
     *   (if not specified, the operation will be applied to all registered tasks)
     */
    clearWorker(id?: WorkerLikeP): this;
    /**
     * Terminates the specified worker or a group of workers
     * @param opts - options for the operation
     */
    clearWorker(opts: ClearProxyOptions<WorkerLikeP>): this;
    /**
     * Creates a new function that wraps the original and returns it.
     *
     * This method doesn't attach any hooks or listeners to the object.
     * However, if the operation is canceled using one of Async's methods, such as cancelProxy,
     * the target function will not be invoked.
     *
     * @param fn
     * @param [opts] - additional options for the operation
     *
     * @example
     * ```js
     * const async = new Async();
     *
     * myImage.onload = async.proxy(() => {
     *   // ...
     * });
     * ```
     */
    proxy<F extends BoundedCb<C>, C extends object = CTX>(fn: F, opts?: AsyncProxyOptions<C>): F;
    /**
     * Returns a new function that allows invoking the passed function only after the specified delay.
     * Any new invocation of the function will cancel the previous one.
     *
     * @param fn
     * @param delay
     * @param [opts] - additional options for the operation
     */
    debounce<F extends BoundedCb<C>, C extends object = CTX>(fn: F, delay: number, opts?: AsyncCbOptions<C>): AnyFunction<Parameters<F>, void>;
    /**
     * Returns a new function that allows invoking the passed function not more often than the specified delay
     *
     * @param fn
     * @param delay
     * @param [opts] - additional options for the operation
     */
    throttle<F extends BoundedCb<C>, C extends object = CTX>(fn: F, delay: number, opts?: AsyncCbOptions<C>): AnyFunction<Parameters<F>, void>;
    /**
     * Cancels the specified proxy function
     *
     * @alias
     * @param [id] - a reference to the function to be canceled
     *   (if not specified, the operation will be applied to all registered tasks)
     */
    cancelProxy(id?: Function): this;
    /**
     * Cancels the specified proxy function or a group of functions
     *
     * @alias
     * @param opts - options for the operation
     */
    cancelProxy(opts: ClearProxyOptions<Function>): this;
    /**
     * Cancels the specified proxy function
     *
     * @param [id] - a reference to the function to be canceled
     *   (if not specified, the operation will be applied to all registered tasks)
     */
    clearProxy(id?: Function): this;
    /**
     * Cancels the specified proxy function or a group of functions
     * @param opts - options for the operation
     */
    clearProxy(opts: ClearProxyOptions<Function>): this;
    /**
     * Mutes the specified proxy function
     *
     * @param [id] - a reference to the function to be muted
     *   (if not specified, the operation will be applied to all registered tasks)
     */
    muteProxy(id?: Function): this;
    /**
     * Mutes the specified proxy function or a group of functions
     * @param opts - options for the operation
     */
    muteProxy(opts: ClearProxyOptions<Function>): this;
    /**
     * Unmutes the specified proxy function
     *
     * @param [id] - a reference to the function to be unmuted
     *   (if not specified, the operation will be applied to all registered tasks)
     */
    unmuteProxy(id?: Function): this;
    /**
     * Unmutes the specified proxy function or a group of functions
     * @param opts - options for the operation
     */
    unmuteProxy(opts: ClearProxyOptions<Function>): this;
    /**
     * Suspends the specified proxy function
     *
     * @param [id] - a reference to the function to be suspended
     *   (if not specified, the operation will be applied to all registered tasks)
     */
    suspendProxy(id?: Function): this;
    /**
     * Suspends the specified proxy function or a group of functions
     * @param opts - options for the operation
     */
    suspendProxy(opts: ClearProxyOptions<Function>): this;
    /**
     * Unsuspends the specified proxy function
     *
     * @param [id] - a reference to the function to be unsuspended
     *   (if not specified, the operation will be applied to all registered tasks)
     */
    unsuspendProxy(id?: Function): this;
    /**
     * Unsuspends the specified proxy function or a group of functions
     * @param opts - options for the operation
     */
    unsuspendProxy(opts: ClearProxyOptions<Function>): this;
    /**
     * Terminates the specified worker
     *
     * @param destructor - the name of the destructor method to be used for termination
     * @param worker - the worker object to be terminated
     */
    workerDestructor(destructor: CanUndef<string>, worker: WorkerLikeP): void;
}
