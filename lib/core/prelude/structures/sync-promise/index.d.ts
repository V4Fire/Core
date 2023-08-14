/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { Value, State, Executor, ResolveHandler, RejectHandler, ConstrRejectHandler, ConstrResolveHandler } from '../../../../core/prelude/structures/sync-promise/interface';
export * from '../../../../core/prelude/structures/sync-promise/interface';
/**
 * Class is similar to the native promise class but works synchronously
 */
export default class SyncPromise<T = unknown> implements Promise<T> {
    /**
     * Returns a SyncPromise object that is resolved with a given value.
     *
     * If the value is a promise, that promise is returned; if the value is a thenable (i.e., has a "then" method),
     * the returned promise will "follow" that thenable, adopting its eventual state; otherwise,
     * the returned promise will be fulfilled with the value.
     *
     * This function flattens nested layers of promise-like objects
     * (e.g., a promise that resolves to a promise that resolves to something) into a single layer.
     *
     * @param value
     */
    static resolve<T = unknown>(value: Value<T>): SyncPromise<T>;
    /**
     * Returns a new resolved SyncPromise object with an undefined value
     */
    static resolve(): SyncPromise<void>;
    /**
     * Returns a SyncPromise object that is rejected with a given reason
     * @param [reason]
     */
    static reject<T = never>(reason?: unknown): SyncPromise<T>;
    /**
     * Takes an iterable of promises and returns a single SyncPromise that resolves to an array of the results
     * of the input promises. This returned promise will resolve when all the input's promises have been resolved or
     * if the input iterable contains no promises. It rejects immediately upon any of the input promises rejecting or
     * non-promises throwing an error and will reject with this first rejection message/error.
     *
     * @param values
     */
    static all<T extends any[] | []>(values: T): SyncPromise<{
        [K in keyof T]: Awaited<T[K]>;
    }>;
    static all<T extends Iterable<Value>>(values: T): SyncPromise<Array<T extends Iterable<Value<infer V>> ? V : unknown>>;
    /**
     * Returns a promise that resolves after all the given promises have either been fulfilled or rejected,
     * with an array of objects describing each promise's outcome.
     *
     * It is typically used when you have multiple asynchronous tasks that are not dependent on one another to
     * complete successfully, or you'd always like to know the result of each promise.
     *
     * In comparison, the SyncPromise returned by `SyncPromise.all()` may be more appropriate
     * if the tasks are dependent on each other / if you'd like to reject upon any of them reject immediately.
     *
     * @param values
     */
    static allSettled<T extends any[] | []>(values: T): SyncPromise<{
        [K in keyof T]: PromiseSettledResult<Awaited<T[K]>>;
    }>;
    static allSettled<T extends Iterable<Value>>(values: T): SyncPromise<Array<T extends Iterable<Value<infer V>> ? PromiseSettledResult<V> : PromiseSettledResult<unknown>>>;
    /**
     * Returns a promise that fulfills or rejects as soon as one of the promises from the iterable fulfills or rejects,
     * with the value or reason from that promise
     *
     * @param values
     */
    static race<T extends Iterable<Value>>(values: T): SyncPromise<T extends Iterable<Value<infer V>> ? V : unknown>;
    /**
     * Takes an iterable of SyncPromise objects and, as soon as one of the promises in the iterable fulfills,
     * returns a single promise that resolves with the value from that promise. If no promises in the iterable fulfill
     * (if all the given promises are rejected), then the returned promise is rejected with an AggregateError,
     * a new subclass of Error that groups together individual errors.
     *
     * @param values
     */
    static any<T extends Iterable<Value>>(values: T): SyncPromise<T extends Iterable<Value<infer V>> ? V : unknown>;
    /** @override */
    readonly [Symbol.toStringTag]: 'Promise';
    /**
     * True if the current promise is pending
     */
    get isPending(): boolean;
    /**
     * Actual promise state
     */
    protected state: State;
    /**
     * Resolved promise value
     */
    protected value: unknown;
    /**
     * List of handlers to handle the promise fulfilling
     */
    protected fulfillHandlers: ConstrResolveHandler[];
    /**
     * List of handlers to handle the promise rejection
     */
    protected rejectHandlers: ConstrRejectHandler[];
    constructor(executor: Executor);
    /**
     * Returns the promise' value if it is fulfilled, otherwise throws an exception
     */
    unwrap(): T;
    /**
     * Attaches handlers for the promise fulfilled and/or rejected states.
     * The method returns a new promise that will be resolved with a value that returns from the passed handlers.
     *
     * @param [onFulfilled]
     * @param [onRejected]
     */
    then<R>(onFulfilled: Nullable<ResolveHandler<T>>, onRejected: RejectHandler<R>): SyncPromise<T | R>;
    then<V>(onFulfilled: ResolveHandler<T, V>, onRejected?: Nullable<RejectHandler<V>>): SyncPromise<V>;
    then<V, R>(onFulfilled: ResolveHandler<T, V>, onRejected: RejectHandler<R>): SyncPromise<V | R>;
    then(onFulfilled?: Nullable<ResolveHandler<T>>, onRejected?: Nullable<RejectHandler<T>>): SyncPromise<T>;
    /**
     * Attaches a handler for the promise' rejected state.
     * The method returns a new promise that will be resolved with a value that returns from the passed handler.
     *
     * @param [onRejected]
     */
    catch<R>(onRejected: RejectHandler<R>): SyncPromise<R>;
    catch(onRejected?: Nullable<RejectHandler<T>>): SyncPromise<T>;
    /**
     * Attaches a common callback for the promise fulfilled and rejected states.
     * The method returns a new promise with the state and value from the current.
     * A value from the passed callback will be ignored unless it equals a rejected promise or exception.
     *
     * @param [cb]
     */
    finally(cb?: Nullable<Function>): SyncPromise<T>;
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
