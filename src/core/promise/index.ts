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
 * Creates a promise that can be resolved from the "outside"
 *
 * @param [opts] - additional options
 * @example
 * ```js
 * const promise = createControllablePromise();
 * promise.resolve(10);
 * ```
 */
export function createControllablePromise<T extends ControllablePromiseConstructor>(
	opts: CreateControllablePromiseOptions<T> = {}
): ControllablePromise<T extends (new(...args: any) => infer R) ? R : Promise<unknown>> {
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
