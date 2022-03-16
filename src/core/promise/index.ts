/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type {

	ControllablePromise,
	ControllablePromiseConstructor,
	CreateControllablePromiseOptions

} from 'core/promise/interface';

export * from 'core/promise/interface';

/**
 * Returns true if the specified promise implements the interface of `ControllablePromise`
 * @param promise
 */
export function isControllablePromise<T extends PromiseLike<any>>(promise: T): promise is ControllablePromise<T>;

/**
 * Returns true if the specified object implements the interface of `ControllablePromise`
 * @param obj
 */
export function isControllablePromise(obj: unknown): obj is ControllablePromise<PromiseLike<unknown>>;
export function isControllablePromise(obj: unknown): boolean {
	return Object.isPromiseLike(obj) && 'resolve' in obj;
}

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
export function createControllablePromise<T extends ControllablePromiseConstructor>(
	opts: CreateControllablePromiseOptions<T>
): ControllablePromise<T extends (new(...args: any[]) => infer R) ? R : Promise<unknown>>;

/**
 * Creates a promise that can be resolved from the "outside"
 *
 * @param [opts] - additional options
 * @typeparam T - type of the resolved promise value
 */
export function createControllablePromise<T = unknown>(
	opts?: CreateControllablePromiseOptions<PromiseConstructor>
): ControllablePromise<Promise<T>>;

export function createControllablePromise(
	opts: CreateControllablePromiseOptions<PromiseConstructor> = {}
): ControllablePromise {
	const
		Constr = opts.type ?? Promise,
		args = opts.args ?? [];

	let
		isPending = true;

	let
		resolve,
		reject;

	const executor = (res, rej, ...args) => {
		resolve = (...args) => {
			isPending = false;

			// eslint-disable-next-line no-useless-call
			res.call(null, ...args);
		};

		reject = (...args) => {
			isPending = false;

			// eslint-disable-next-line no-useless-call
			rej.call(null, ...args);
		};

		opts.executor?.(resolve, reject, ...args);
	};

	// @ts-ignore (args is an iterable)
	const promise = <ControllablePromise<T>>new Constr(executor, ...args);

	if (!('isPending' in promise)) {
		Object.defineProperty(promise, 'isPending', {
			enumerable: true,
			configurable: true,

			get() {
				return isPending;
			}
		});
	}

	promise.resolve = (...args) => {
		resolve?.(...args);
		return promise;
	};

	promise.reject = (...args) => {
		reject?.(...args);
		return promise;
	};

	return Object.cast(promise);
}
