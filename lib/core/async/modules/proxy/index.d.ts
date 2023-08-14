/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import Super, { BoundFn, AsyncOptions, AsyncCbOptions, AsyncProxyOptions, ClearProxyOptions, ClearOptionsId } from '../../../../core/async/modules/base';
import type { WorkerLikeP, PromiseLikeP, CancelablePromise, AsyncRequestOptions, AsyncWorkerOptions, AsyncPromiseOptions } from '../../../../core/async/interface';
export * from '../../../../core/async/modules/base';
export * from '../../../../core/async/interface';
export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
    /**
     * Wraps the specified worker object.
     *
     * This method doesn't attach any hook or listeners to the object,
     * but every time the same object is registered, Async will increment the number of links that relate to this object.
     * After, when we try to destroy the worker by using one of Async's methods, like, `terminateWorker`,
     * it will de-increment values of links. When the number of links is equal to zero,
     * Async will try to call a "real" object destructor by using one of the possible destructor methods from
     * the whitelist or by the specified destructor name, also if the worker is a function,
     * it is interpreted as the destructor.
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
     * // This function will work as the worker destructor
     * async.worker(() => el.remove());
     *
     * const
     *   myWorker = new Worker('my-worker.js');
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
     * @param [id] - link to the worker (if not specified, then the operation will be applied for all registered tasks)
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
     * @param [id] - link to the worker (if not specified, then the operation will be applied for all registered tasks)
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
     * This method doesn't attach any hook or listeners to the object,
     * but if we cancel the operation by using one of Async's methods, like, `cancelProxy`,
     * the target function won't be invoked.
     *
     * @param fn
     * @param [opts] - additional options for the operation
     *
     * @example
     * ```js
     * const
     *   async = new Async();
     *
     * myImage.onload = async.proxy(() => {
     *   // ...
     * });
     * ```
     */
    proxy<F extends BoundFn<C>, C extends object = CTX>(fn: F, opts?: AsyncProxyOptions<C>): F;
    /**
     * Returns a new function that allows invoking the passed function only with the specified delay.
     * The next invocation of the function will cancel the previous.
     *
     * @param fn
     * @param delay
     * @param [opts] - additional options for the operation
     */
    debounce<F extends BoundFn<C>, C extends object = CTX>(fn: F, delay: number, opts?: AsyncCbOptions<C>): AnyFunction<Parameters<F>, void>;
    /**
     * Returns a new function that allows invoking the passed function not more often than the specified delay
     *
     * @param fn
     * @param delay
     * @param [opts] - additional options for the operation
     */
    throttle<F extends BoundFn<C>, C extends object = CTX>(fn: F, delay: number, opts?: AsyncCbOptions<C>): AnyFunction<Parameters<F>, void>;
    /**
     * Cancels the specified proxy function
     *
     * @alias
     * @param [id] - link to the function (if not specified, then the operation will be applied for all registered tasks)
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
     * @param [id] - link to the function (if not specified, then the operation will be applied for all registered tasks)
     */
    clearProxy(id?: Function): this;
    /**
     * Cancels the specified proxy function or a group of functions
     * @param opts - options for the operation
     */
    clearProxy(opts: ClearProxyOptions<Function>): this;
    /**
     * Mutes the specified proxy function
     * @param [id] - link to the function (if not specified, then the operation will be applied for all registered tasks)
     */
    muteProxy(id?: Function): this;
    /**
     * Mutes the specified proxy function or a group of functions
     * @param opts - options for the operation
     */
    muteProxy(opts: ClearProxyOptions<Function>): this;
    /**
     * Unmutes the specified proxy function
     * @param [id] - link to the function (if not specified, then the operation will be applied for all registered tasks)
     */
    unmuteProxy(id?: Function): this;
    /**
     * Unmutes the specified proxy function or a group of functions
     * @param opts - options for the operation
     */
    unmuteProxy(opts: ClearProxyOptions<Function>): this;
    /**
     * Suspends the specified proxy function
     * @param [id] - link to the function (if not specified, then the operation will be applied for all registered tasks)
     */
    suspendProxy(id?: Function): this;
    /**
     * Suspends the specified proxy function or a group of functions
     * @param opts - options for the operation
     */
    suspendProxy(opts: ClearProxyOptions<Function>): this;
    /**
     * Unsuspends the specified proxy function
     * @param [id] - link to the function (if not specified, then the operation will be applied for all registered tasks)
     */
    unsuspendProxy(id?: Function): this;
    /**
     * Unsuspends the specified proxy function or a group of functions
     * @param opts - options for the operation
     */
    unsuspendProxy(opts: ClearProxyOptions<Function>): this;
    /**
     * Creates a promise that wraps the passed request and returns it.
     *
     * This method doesn't attach any hook or listeners to the object,
     * but if we cancel the operation by using one of Async's methods, like, "cancelRequest",
     * the promise will be rejected.
     *
     * The request can be provided as a promise or function, that returns a promise.
     * Notice, the method uses `Async.promise`, but with a different namespace: `request` instead of `promise`.
     *
     * @param request
     * @param [opts] - additional options for the operation
     *
     * @example
     * ```js
     * const async = new Async();
     * async.request(fetch('foo/bla'));
     * ```
     */
    request<T = unknown>(request: (() => PromiseLike<T>) | PromiseLike<T>, opts?: AsyncRequestOptions): Promise<T>;
    /**
     * Cancels the specified request.
     * The canceled promise will be automatically rejected.
     *
     * @alias
     * @param [id] - link to the request (if not specified, then the operation will be applied for all registered tasks)
     */
    cancelRequest(id?: Promise<unknown>): this;
    /**
     * Cancels the specified request or a group of requests.
     * The canceled promises will be automatically rejected.
     *
     * @alias
     * @param opts - options for the operation
     */
    cancelRequest(opts: ClearOptionsId<Promise<unknown>>): this;
    /**
     * Cancels the specified request.
     * The canceled promise will be automatically rejected.
     *
     * @param [id] - link to the request (if not specified, then the operation will be applied for all registered tasks)
     */
    clearRequest(id?: Promise<unknown>): this;
    /**
     * Cancels the specified request or a group of requests.
     * The canceled promises will be automatically rejected.
     *
     * @param opts - options for the operation
     */
    clearRequest(opts: ClearOptionsId<Promise<unknown>>): this;
    /**
     * Mutes the specified request.
     * If the request is resolved during it muted, the promise wrapper will be rejected.
     *
     * @param [id] - link to the request (if not specified, then the operation will be applied for all registered tasks)
     */
    muteRequest(id?: Promise<unknown>): this;
    /**
     * Mutes the specified request or a group of requests.
     * If the requests are resolved during muted, the promise wrappers will be rejected.
     *
     * @param opts - options for the operation
     */
    muteRequest(opts: ClearOptionsId<Promise<unknown>>): this;
    /**
     * Unmutes the specified request
     * @param [id] - link to the request (if not specified, then the operation will be applied for all registered tasks)
     */
    unmuteRequest(id?: Promise<unknown>): this;
    /**
     * Unmutes the specified request or a group of requests
     * @param opts - options for the operation
     */
    unmuteRequest(opts: ClearOptionsId<Promise<unknown>>): this;
    /**
     * Suspends the specified request
     * @param [id] - link to the request (if not specified, then the operation will be applied for all registered tasks)
     */
    suspendRequest(id?: Promise<unknown>): this;
    /**
     * Suspends the specified request or a group of requests
     * @param opts - options for the operation
     */
    suspendRequest(opts: ClearOptionsId<Promise<unknown>>): this;
    /**
     * Unsuspends the specified request
     * @param [id] - link to the request (if not specified, then the operation will be applied for all registered tasks)
     */
    unsuspendRequest(id?: Promise<unknown>): this;
    /**
     * Unsuspends the specified request or a group of requests
     * @param opts - options for the operation
     */
    unsuspendRequest(opts: ClearOptionsId<Promise<unknown>>): this;
    /**
     * Creates a new asynchronous iterable object from the specified iterable and returns it.
     * If the passed iterable doesn't have `Symbol.asyncIterator`, it will be created from a synchronous object iterator
     * (the synchronous iterator will also be preserved).
     *
     * Notice, until the created promise object isn't executed by invoking the `next` method,
     * any async operations won't be registered.
     *
     * @param iterable
     * @param [opts] - additional options for the operation
     *
     * @example
     * ```js
     * const async = new Async();
     *
     * for await (const el of async.iterable([1, 2, 3, 4])) {
     *   console.log(el);
     * }
     * ```
     */
    iterable<T>(iterable: Iterable<T> | AsyncIterable<T>, opts?: AsyncOptions): AsyncIterable<T> | AsyncIterable<T> & Iterable<T>;
    /**
     * Cancels the specified iterable object.
     * Notice that cancellation affects only objects that have already been activated by invoking the `next` method.
     * So, for example, canceled iterable will throw an error on the next invoking of `next`.
     *
     * @alias
     * @param [id] - link to the iterable (if not specified, then the operation will be applied for all registered tasks)
     */
    cancelIterable(id?: AsyncIterable<unknown>): this;
    /**
     * Cancels the specified iterable or a group of iterable.
     * Notice that cancellation affects only objects that have already been activated by invoking the `next` method.
     * So, for example, canceled iterable will throw an error on the next invoking of `next`.
     *
     * @alias
     * @param opts - options for the operation
     */
    cancelIterable(opts: ClearOptionsId<AsyncIterable<unknown>>): this;
    /**
     * Cancels the specified iterable object.
     * Notice that cancellation affects only objects that have already been activated by invoking the `next` method.
     * So, for example, canceled iterable will throw an error on the next invoking of `next`.
     *
     * @param [id] - link to the request (if not specified, then the operation will be applied for all registered tasks)
     */
    clearIterable(id?: Promise<unknown>): this;
    /**
     * Cancels the specified iterable object.
     * Notice that cancellation affects only objects that have already been activated by invoking the `next` method.
     * So, for example, canceled iterable will throw an error on the next invoking of `next`.
     *
     * @param opts - options for the operation
     */
    clearIterable(opts: ClearOptionsId<Promise<unknown>>): this;
    /**
     * Mutes the specified iterable object.
     * Elements that are consumed during the object is muted will be ignored.
     * Notice that muting affects only objects that have already been activated by invoking the `next` method.
     *
     * @param [id] - link to the iterable (if not specified, then the operation will be applied for all registered tasks)
     */
    muteIterable(id?: AsyncIterable<unknown>): this;
    /**
     * Mutes the specified iterable object or a group of iterable objects.
     * Elements, that are consumed during the object is muted will be ignored.
     * Notice that muting affects only objects that have already been activated by invoking the `next` method.
     *
     * @param opts - options for the operation
     */
    muteIterable(opts: ClearOptionsId<AsyncIterable<unknown>>): this;
    /**
     * Unmutes the specified iterable object
     * @param [id] - link to the iterable (if not specified, then the operation will be applied for all registered tasks)
     */
    unmuteIterable(id?: AsyncIterable<unknown>): this;
    /**
     * Unmutes the specified iterable function or a group of iterable objects
     * @param opts - options for the operation
     */
    unmuteIterable(opts: ClearOptionsId<AsyncIterable<unknown>>): this;
    /**
     * Suspends the specified iterable object.
     * Notice that suspending affects only objects that have already been activated by invoking the `next` method.
     *
     * @param [id] - link to the iterable (if not specified, then the operation will be applied for all registered tasks)
     */
    suspendIterable(id?: AsyncIterable<unknown>): this;
    /**
     * Suspends the specified iterable or a group of iterable objects.
     * Notice that suspending affects only objects that have already been activated by invoking the `next` method.
     *
     * @param opts - options for the operation
     */
    suspendIterable(opts: ClearOptionsId<AsyncIterable<unknown>>): this;
    /**
     * Unsuspends the specified iterable object
     * @param [id] - link to the iterable (if not specified, then the operation will be applied for all registered tasks)
     */
    unsuspendIterable(id?: AsyncIterable<unknown>): this;
    /**
     * Unsuspends the specified iterable or a group of iterable objects
     * @param opts - options for the operation
     */
    unsuspendIterable(opts: ClearOptionsId<AsyncIterable<unknown>>): this;
    /**
     * Creates a new promise that wraps the passed promise and returns it.
     *
     * This method doesn't attach any hook or listeners to the object,
     * but if we cancel the operation by using one of Async's methods, like, "cancelPromise",
     * the promise will be rejected.
     *
     * The promise can be provided as it is or as a function, that returns a promise.
     *
     * @param promise
     * @param [opts] - additional options for the operation
     *
     * @example
     * ```js
     * const
     *   async = new Async();
     *
     * async.promise(new Promise(() => {
     *   // ...
     * }))
     * ```
     */
    promise<T = unknown>(promise: PromiseLikeP<T>, opts?: AsyncPromiseOptions): Promise<T>;
    /**
     * Cancels the specified promise.
     * The canceled promise will be automatically rejected.
     *
     * @alias
     * @param [id] - link to the promise (if not specified, then the operation will be applied for all registered tasks)
     */
    cancelPromise(id?: Promise<unknown>): this;
    /**
     * Cancels the specified promise or a group of promises.
     * The canceled promises will be automatically rejected.
     *
     * @alias
     * @param opts - options for the operation
     */
    cancelPromise(opts: ClearProxyOptions<Promise<unknown>>): this;
    /**
     * Cancels the specified promise.
     * The canceled promise will be automatically rejected.
     *
     * @param [id] - link to the promise (if not specified, then the operation will be applied for all registered tasks)
     */
    clearPromise(id?: Promise<unknown>): this;
    /**
     * Cancels the specified promise or a group of promises.
     * The canceled promises will be automatically rejected.
     *
     * @param opts - options for the operation
     */
    clearPromise(opts: ClearProxyOptions<Promise<unknown>>): this;
    /**
     * Mutes the specified promise.
     * If the promise is resolved during it muted, the promise wrapper will be rejected.
     *
     * @param [id] - link to the promise (if not specified, then the operation will be applied for all registered tasks)
     */
    mutePromise(id?: Promise<unknown>): this;
    /**
     * Mutes the specified promise or a group of promises.
     * If the promises are resolved during muted, the promise wrappers will be rejected.
     *
     * @param opts - options for the operation
     */
    mutePromise(opts: ClearOptionsId<Promise<unknown>>): this;
    /**
     * Unmutes the specified promise
     * @param [id] - link to the promise (if not specified, then the operation will be applied for all registered tasks)
     */
    unmutePromise(id?: Promise<unknown>): this;
    /**
     * Unmutes the specified promise or a group of promises
     * @param opts - options for the operation
     */
    unmutePromise(opts: ClearOptionsId<Promise<unknown>>): this;
    /**
     * Suspends the specified promise
     * @param [id] - link to the promise (if not specified, then the operation will be applied for all registered tasks)
     */
    suspendPromise(id?: Promise<unknown>): this;
    /**
     * Suspends the specified promise or a group of promises
     * @param opts - options for the operation
     */
    suspendPromise(opts: ClearOptionsId<Promise<unknown>>): this;
    /**
     * Unsuspends the specified promise
     * @param [id] - link to the promise (if not specified, then the operation will be applied for all registered tasks)
     */
    unsuspendPromise(id?: Promise<unknown>): this;
    /**
     * Unsuspends the specified promise or a group of promises
     * @param opts - options for the operation
     */
    unsuspendPromise(opts: ClearOptionsId<Promise<unknown>>): this;
    /**
     * Terminates the specified worker
     *
     * @param destructor - name of the destructor method
     * @param worker
     */
    workerDestructor(destructor: CanUndef<string>, worker: WorkerLikeP): void;
    /**
     * Terminates the specified promise
     *
     * @param destructor - name of the destructor method
     * @param promise
     */
    promiseDestructor(destructor: CanUndef<string>, promise: PromiseLike<unknown> | CancelablePromise): void;
    /**
     * Factory to create promise clear handlers
     *
     * @param resolve
     * @param reject
     */
    onPromiseClear(resolve: Function, reject: Function): Function;
    /**
     * Factory to create promise merge handlers
     *
     * @param resolve
     * @param reject
     */
    onPromiseMerge(resolve: Function, reject: Function): Function;
    /**
     * Marks a promise with the specified label
     *
     * @param label
     * @param [id] - operation id (if not specified, the operation will be extended for all promise namespaces)
     */
    protected markPromise(label: string, id?: Promise<unknown>): this;
    /**
     * Marks a promise or group of promises with the specified label
     *
     * @param label
     * @param opts - additional options
     */
    protected markPromise(label: string, opts: ClearOptionsId<Promise<unknown>>): this;
    /**
     * Returns an iterator from the passed iterable object.
     * Notice, an asynchronous iterator has more priority.
     *
     * @param [iterable]
     */
    protected getBaseIterator<T>(iterable: Iterable<T> | AsyncIterable<T>): CanUndef<IterableIterator<T> | AsyncIterableIterator<T>>;
}
