/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type Async from '../../../../core/async';
import type { AsyncOptions, AsyncProxyOptions, ProxyCb } from '../../../../core/async/interface';
/**
 * Something that looks like a worker
 */
export interface WorkerLike {
    terminate?: Function;
    destroy?: Function;
    destructor?: Function;
    close?: Function;
    abort?: Function;
    cancel?: Function;
    disconnect?: Function;
    unwatch?: Function;
}
/**
 * Extended type of worker
 */
export declare type WorkerLikeP = Function | WorkerLike;
/**
 * Promise that supports canceling
 */
export interface CancelablePromise<T = unknown> extends Promise<T> {
    abort?: Function;
    cancel?: Function;
}
/**
 * Extended type of promise
 */
export declare type PromiseLikeP<T = unknown> = (() => PromiseLike<T>) | PromiseLike<T>;
export interface AsyncRequestOptions extends AsyncOptions {
    /**
     * Name of a destructor method
     */
    destructor?: string;
}
export interface AsyncWorkerOptions<CTX extends object = Async> extends AsyncProxyOptions<CTX> {
    /**
     * Name of a destructor method
     */
    destructor?: string;
}
export interface AsyncPromiseOptions extends AsyncOptions {
    /**
     * Namespace of the proxy
     */
    name?: string;
    /**
     * Name of a destructor method
     */
    destructor?: string;
    /**
     * Handler/s of muted promise resolving.
     * These handlers are invoked when occurring resolving the promise if it is muted.
     */
    onMutedResolve?: CanArray<ProxyCb<AnyFunction, AnyFunction>>;
}
