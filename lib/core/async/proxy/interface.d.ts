/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type Async from '../../../core/async';
import type { PrimitiveNamespaces } from '../../../core/async/const';
import type { AsyncOptions, AsyncProxyOptions, ProxyCb } from '../../../core/async/interface';
/**
 * Something that resembles a worker
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
 * An extended type of worker
 */
export declare type WorkerLikeP = Function | WorkerLike;
/**
 * A promise that supports cancellation
 */
export interface CancelablePromise<T = unknown> extends Promise<T> {
    abort?: Function;
    cancel?: Function;
}
/**
 * An extended type of promise
 */
export declare type PromiseLikeP<T = unknown> = (() => PromiseLike<T>) | PromiseLike<T>;
export interface AsyncRequestOptions extends AsyncOptions {
    /**
     * The name of the destructor method
     */
    destructor?: string;
}
export interface AsyncWorkerOptions<CTX extends object = Async> extends AsyncProxyOptions<CTX> {
    /**
     * The name of the destructor method
     */
    destructor?: string;
}
export interface AsyncPromiseOptions extends AsyncOptions {
    /**
     * Namespace for the proxy
     */
    namespace?: PrimitiveNamespaces;
    /**
     * The name of the destructor method
     */
    destructor?: string;
    /**
     * Handler(s) for muted promise resolution.
     * These handlers are invoked when the muted promise is resolved.
     */
    onMutedResolve?: CanArray<ProxyCb<AnyFunction, AnyFunction>>;
}
