/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { ControllablePromise } from 'core/request/modules/stream-buffer/interface';

/**
 * Returns a promise that can be resolved externally
 */
export function createControllablePromise<R = unknown>(): ControllablePromise<R> {
	let
		resolve,
		reject;

	const promise = new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return Object.cast(Object.assign(promise, {resolve, reject}));
}
