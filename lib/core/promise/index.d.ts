/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { ControllablePromise, ControllablePromiseConstructor, CreateControllablePromiseOptions } from '../../core/promise/interface';
export * from '../../core/promise/interface';
/**
 * Returns true if the specified promise implements the interface of `ControllablePromise`
 * @param promise
 */
export declare function isControllablePromise<T extends PromiseLike<any>>(promise: T): promise is ControllablePromise<T>;
/**
 * Returns true if the specified object implements the interface of `ControllablePromise`
 * @param obj
 */
export declare function isControllablePromise(obj: unknown): obj is ControllablePromise<PromiseLike<unknown>>;
/**
 * Creates a promise that can be resolved from the "outside"
 *
 * @param opts - additional options
 * @typeparam T - promise constructor
 *
 * @example
 * ```js
 * const promise = createControllablePromise();
 * promise.resolve(10);
 * ```
 */
export declare function createControllablePromise<T extends ControllablePromiseConstructor>(opts: CreateControllablePromiseOptions<T>): ControllablePromise<T extends (new (...args: any[]) => infer R) ? R : Promise<unknown>>;
/**
 * Creates a promise that can be resolved from the "outside"
 *
 * @param [opts] - additional options
 * @typeparam T - type of the resolved promise value
 */
export declare function createControllablePromise<T = unknown>(opts?: CreateControllablePromiseOptions<PromiseConstructor>): ControllablePromise<Promise<T>>;
