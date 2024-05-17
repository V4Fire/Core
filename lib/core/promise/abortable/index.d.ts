/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { Value, ExecutableValue, State, Executor, ResolveHandler, RejectHandler, ConstrResolveHandler, ConstrRejectHandler } from '../../../core/promise/abortable/interface';
export * from '../../../core/promise/abortable/const';
export * from '../../../core/promise/abortable/interface';
/**
 * Class wraps promise-like objects and adds to them some extra functionality,
 * such as possibility of cancellation, etc.
 *
 * @typeparam T - promise resolved value
 */
export default class AbortablePromise<T = unknown> implements Promise<T> {
    /**
     * The method wraps the specified abort reason to ignore with tied promises,
     * i.e., this reason won't reject all child promises
     *
     * @param reason
     */
    static wrapReasonToIgnore<T extends object>(reason: T): T;
    /**
     * Returns an AbortablePromise object that is resolved with a given value.
     *
     * If the value is a promise, that promise is returned; if the value is a thenable (i.e., has a "then" method),
     * the returned promise will "follow" that thenable, adopting its eventual state; otherwise,
     * the returned promise will be fulfilled with the value.
     *
     * This function flattens nested layers of promise-like objects
     * (e.g., a promise that resolves to a promise that resolves to something) into a single layer.
     *
     * @param value
     * @param [parent] - parent promise
     */
    static resolve<T = unknown>(value: Value<T>, parent?: AbortablePromise): AbortablePromise<T>;
    /**
     * Returns a new resolved AbortablePromise object with an undefined value
     */
    static resolve(): AbortablePromise<void>;
    /**
     * Returns an AbortablePromise object that is resolved with a given value.
     * If the resolved value is a function, it will be invoked.
     * The result of the invoking will be provided as a value of the promise.
     *
     * If the value is a promise, that promise is returned; if the value is a thenable (i.e., has a "then" method),
     * the returned promise will "follow" that thenable, adopting its eventual state; otherwise,
     * the returned promise will be fulfilled with the value.
     *
     * This function flattens nested layers of promise-like objects
     * (e.g., a promise that resolves to a promise that resolves to something) into a single layer.
     *
     * @param value
     * @param [parent] - parent promise
     */
    static resolveAndCall<T = unknown>(value: ExecutableValue<T>, parent?: AbortablePromise): AbortablePromise<T>;
    /**
     * Returns a new resolved AbortablePromise object with an undefined value
     */
    static resolveAndCall(): AbortablePromise<void>;
    /**
     * Returns an AbortablePromise object that is rejected with a given reason
     *
     * @param [reason]
     * @param [parent] - parent promise
     */
    static reject<T = never>(reason?: unknown, parent?: AbortablePromise): AbortablePromise<T>;
    /**
     * Takes an iterable of promises and returns a single AbortablePromise that resolves to an array of the results
     * of the input promises. This returned promise will resolve when all the input's promises have been resolved or
     * if the input iterable contains no promises. It rejects immediately upon any of the input promises rejecting or
     * non-promises throwing an error and will reject with this first rejection message/error.
     *
     * @param values
     * @param [parent] - parent promise
     */
    static all<T extends any[] | []>(values: T, parent?: AbortablePromise): AbortablePromise<{
        [K in keyof T]: Awaited<T[K]>;
    }>;
    static all<T extends Iterable<Value>>(values: T, parent?: AbortablePromise): AbortablePromise<Array<T extends Iterable<Value<infer V>> ? V : unknown>>;
    /**
     * Returns a promise that resolves after all the given promises have either been fulfilled or rejected,
     * with an array of objects describing each promise's outcome.
     *
     * It is typically used when you have multiple asynchronous tasks that are not dependent on one another to
     * complete successfully, or you'd always like to know the result of each promise.
     *
     * In comparison, the AbortablePromise returned by `AbortablePromise.all()` may be more appropriate
     * if the tasks are dependent on each other / if you'd like to reject upon any of them reject immediately.
     *
     * @param values
     * @param [parent] - parent promise
     */
    static allSettled<T extends any[] | []>(values: T, parent?: AbortablePromise): AbortablePromise<{
        [K in keyof T]: PromiseSettledResult<Awaited<T[K]>>;
    }>;
    static allSettled<T extends Iterable<Value>>(values: T, parent?: AbortablePromise): AbortablePromise<Array<T extends Iterable<Value<infer V>> ? PromiseSettledResult<V> : PromiseSettledResult<unknown>>>;
    /**
     * Creates an abortable promise that is resolved or rejected when any of the provided promises are resolved or
     * rejected
     *
     * @param values
     * @param [parent] - parent promise
     */
    static race<T extends Iterable<Value>>(values: T, parent?: AbortablePromise): AbortablePromise<T extends Iterable<Value<infer V>> ? V : unknown>;
    /**
     * Creates a promise that is resolved when any of the provided promises are resolved or
     * rejected if the provided all promises are rejected
     *
     * @param values
     * @param [parent] - parent promise
     */
    static any<T extends Iterable<Value>>(values: T, parent?: AbortablePromise): AbortablePromise<T extends Iterable<Value<infer V>> ? V : unknown>;
    /** @override */
    readonly [Symbol.toStringTag]: 'Promise';
    /**
     * True if the current promise is pending
     */
    get isPending(): boolean;
    /**
     * Number of pending child promises
     */
    protected pendingChildren: number;
    /**
     * Actual promise state
     */
    protected state: State;
    /**
     * Resolved promise value
     */
    protected value: unknown;
    /**
     * If true, then the promise was aborted
     */
    protected aborted: boolean;
    /**
     * Internal native promise instance
     */
    protected promise: Promise<T>;
    /**
     * Handler of the native promise resolving
     */
    protected onResolve: ConstrResolveHandler<T>;
    /**
     * Handler of the native promise rejection
     */
    protected onReject: ConstrRejectHandler;
    /**
     * Handler of the native promise rejection that was raised by a reason of abort
     */
    protected onAbort: ConstrRejectHandler;
    /**
     * @param executor - executor function
     * @param [parent] - parent promise
     */
    constructor(executor: Executor<T>, parent?: AbortablePromise);
    /**
     * Attaches handlers for the promise fulfilled and/or rejected states.
     * The method returns a new promise that will be resolved with a value that returns from the passed handlers.
     *
     * @param [onFulfilled]
     * @param [onRejected]
     * @param [onAbort]
     */
    then<R>(onFulfilled: Nullable<ResolveHandler<T>>, onRejected: RejectHandler<R>, onAbort?: Nullable<ConstrRejectHandler>): AbortablePromise<T | R>;
    then<V>(onFulfilled: ResolveHandler<T, V>, onRejected?: Nullable<RejectHandler<V>>, onAbort?: Nullable<ConstrRejectHandler>): AbortablePromise<V>;
    then<V, R>(onFulfilled: ResolveHandler<T, V>, onRejected: RejectHandler<R>, onAbort?: Nullable<ConstrRejectHandler>): AbortablePromise<V | R>;
    then(onFulfilled?: Nullable<ResolveHandler<T>>, onRejected?: Nullable<RejectHandler<T>>, onAbort?: Nullable<ConstrRejectHandler>): AbortablePromise<T>;
    /**
     * Attaches a handler for the promise' rejected state.
     * The method returns a new promise that will be resolved with a value that returns from the passed handler.
     *
     * @param [onRejected]
     */
    catch<R>(onRejected: RejectHandler<R>): AbortablePromise<R>;
    catch(onRejected?: Nullable<RejectHandler<T>>): AbortablePromise<T>;
    /**
     * Attaches a common callback for the promise fulfilled and rejected states.
     * The method returns a new promise with the state and value from the current.
     * A value from the passed callback will be ignored unless it equals a rejected promise or exception.
     *
     * @param [cb]
     */
    finally(cb?: Nullable<Function>): AbortablePromise<T>;
    /**
     * Aborts the current promise (the promise will be rejected)
     * @param [reason] - abort reason
     */
    abort(reason?: unknown): boolean;
    /**
     * Executes a function with the specified parameters
     *
     * @param fn
     * @param args - arguments for the function
     * @param [onError] - error handler
     * @param [onValue] - success handler
     */
    protected call<A = unknown, V = unknown>(fn: Nullable<Function>, args?: A[], onError?: ConstrRejectHandler, onValue?: AnyOneArgFunction<V>): void;
}
