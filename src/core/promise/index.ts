/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { ControllablePromise, CreateControllablePromiseOptions } from 'core/promise/interface';

export * from 'core/promise/interface';

/**
 * Creates a promise that can be resolved from the "outside"
 *
 * @param [opts] - additional options
 * @example
 * ```js
 * const promise = createControllablePromise();
 * promise.resolve(10);
 * ```
 */
export function createControllablePromise(opts: CreateControllablePromiseOptions = {}): ControllablePromise {
	const
		Constr = opts.type ?? Promise;

	let
		resolve,
		reject;

	const promise = <ControllablePromise>new Constr((res, rej, ...args) => {
		resolve = res;
		reject = rej;

		opts.executor?.(res, rej, ...args);
	});

	promise.resolve = (...args) => {
		resolve(...args);
		return promise;
	};

	promise.reject = (...args) => {
		reject(...args);
		return promise;
	};

	return promise;
}
