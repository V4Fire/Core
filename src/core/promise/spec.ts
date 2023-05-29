/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SyncPromise from 'core/promise/sync';
import AbortablePromise from 'core/promise/abortable';

import { createControllablePromise, isControllablePromise } from 'core/promise';

describe('core/promise', () => {
	describe('`createControllablePromise`', () => {
		it('should provide a method to resolve', async () => {
			const promise = createControllablePromise();
			expect(await promise.resolve(10)).toBe(10);
		});

		it('should provide a method to reject', async () => {
			const promise = createControllablePromise();
			expect(await promise.reject('Boom!').catch((msg) => msg)).toBe('Boom!');
		});

		it('should provide a getter to check if the promise is pending', () => {
			const promise = createControllablePromise();

			expect(promise.isPending).toBe(true);
			promise.resolve(10);

			expect(promise.isPending).toBe(false);
		});

		it('providing a custom promise constructor', () => {
			const promise = createControllablePromise({
				type: SyncPromise
			});

			let
				res;

			promise.resolve(10).then((val) => {
				res = val;
			});

			expect(res).toBe(10);
		});

		it('providing a custom promise executor', async () => {
			const promise = createControllablePromise<number>({
				executor: (resolve) => resolve(5)
			});

			expect(await promise.resolve(10)).toBe(5);
		});

		it('providing a custom promise constructor and executor', async () => {
			let
				res;

			const promise = createControllablePromise({
				type: AbortablePromise,
				executor: (resolve, reject, onAbort) => {
					onAbort((reason) => {
						res = reason;
					});
				}
			});

			try {
				promise.abort('Boom!');
				await promise;
			} catch {}

			expect(res).toBe('Boom!');
		});

		it('providing a custom promise constructor and extra arguments', async () => {
			const parent = AbortablePromise.reject('Boom!');

			parent.catch(() => {
				// Do nothing
			});

			const promise = createControllablePromise({
				type: AbortablePromise,
				args: [parent]
			});

			let
				res;

			try {
				await promise.resolve(10);

			} catch (err) {
				res = err;
			}

			expect(res).toBe('Boom!');
		});
	});

	describe('`isControllablePromise`', () => {
		it('should return true for controllable promises', () => {
			expect(isControllablePromise(createControllablePromise())).toBe(true);
			expect(isControllablePromise(createControllablePromise({type: AbortablePromise}))).toBe(true);
		});

		it('should return false for non-controllable promises or non-promise values', () => {
			expect(isControllablePromise(Promise.resolve(1))).toBe(false);
			expect(isControllablePromise(AbortablePromise.resolve(1))).toBe(false);
			expect(isControllablePromise(1)).toBe(false);
		});
	});
});
