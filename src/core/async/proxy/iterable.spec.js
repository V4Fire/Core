/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Async from 'core/async';
import SyncPromise from 'core/promise/sync';

describe('core/async/modules/proxy `iterable`', () => {
	let
		$a,
		asyncIterator;

	beforeEach(() => {
		$a = new Async();

		asyncIterator = {
			async*[Symbol.asyncIterator]() {
				for (const el of [1, 2, 3, 4]) {
					await new Promise((r) => setTimeout(r, 100));
					yield el;
				}
			}
		};
	});

	describe('wraps a synchronous iterable object', () => {
		it('using for await', async () => {
			const
				iter = $a.iterable([1, 2, 3, 4]);

			let
				i = 0;

			for await (const item of iter) {
				i++;
				expect(item).toEqual(i);
			}
		});

		it('manual invoking of `next`', async () => {
			const asyncIter = $a.iterable([1, 2, 3])[Symbol.asyncIterator]();
			expect(await asyncIter.next()).toEqual({done: false, value: 1});
		});
	});

	describe('wraps an asynchronous iterable object', () => {
		beforeEach(() => {
			$a = new Async();
		});

		it('manual invoking of `next`', async () => {
			const asyncIter = $a.iterable(asyncIterator)[Symbol.asyncIterator]();
			expect(await asyncIter.next()).toEqual({done: false, value: 1});
		});

		it('cancellation of the iteration', async () => {
			const
				iterable = $a.iterable(asyncIterator),
				asyncIter = iterable[Symbol.asyncIterator]();

			expect(await asyncIter.next()).toEqual({
				done: false,
				value: 1
			});

			const promise1 = asyncIter.next();
			$a.cancelIterable(iterable);

			await expect(promise1).rejects.toBeTruthy();

			const promise2 = asyncIter.next();
			await expect(promise2).rejects.toBeTruthy();
		});

		it('suspending/unsuspending of the iteration', async () => {
			const
				iterable = $a.iterable(asyncIterator),
				asyncIter = iterable[Symbol.asyncIterator]();

			expect(await asyncIter.next()).toEqual({
				done: false,
				value: 1
			});

			const nextIter = asyncIter.next();
			$a.suspendIterable(iterable);

			await $a.sleep(200);
			await expectToBePending(nextIter);
			$a.unsuspendIterable(iterable);

			expect(await nextIter).toEqual({
				done: false,
				value: 2
			});
		});

		it('muting/unmuting of the iteration', async () => {
			const
				iterable = $a.iterable(asyncIterator),
				asyncIter = iterable[Symbol.asyncIterator]();

			expect(await asyncIter.next()).toEqual({
				done: false,
				value: 1
			});

			const nextIter = asyncIter.next();
			$a.muteIterable(iterable);

			await $a.sleep(150);
			await expectToBePending(nextIter);
			$a.unmuteIterable(iterable);

			expect(await nextIter).toEqual({
				done: false,
				value: 3
			});
		});
	});
});

function expectToBePending(promise) {
	const want = {};

	return SyncPromise.race([promise, SyncPromise.resolve(want)])
		.then((val) => {
			expect(val).toEqual(want);
		});
}
