/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Async from 'core/async';
import SyncPromise from 'core/promise/sync';

const objWithAsyncIterator = {
	[Symbol.asyncIterator]() {
		return {
			data: [1, 2, 3, 4],
			index: 0,
			next() {
				const {data, index} = this;

				return new Promise((resolve) => {
					setTimeout(
						() =>
							resolve({
								done: Boolean(index > data.length),
								value: data[this.index++]
							}),
						100
					);
				});
			}
		};
	}
};

const expectToBePending = (promise) => {
	const want = {};

	return SyncPromise.race([promise, SyncPromise.resolve(want)])
	.then((val) => {
		expect(val).withContext('Promise should be pending').toEqual(want);
	})
	.catch((err) => {
		fail(err);
	});
};

const expectToBeResolved = (promise) => {
	const obj = {};

	return SyncPromise.race([promise, SyncPromise.resolve(obj)])
	.then((val) => {
		expect(val).withContext('Promise should be pending').not.toEqual(obj);
	})
	.catch((err) => {
		fail(err);
	});
};

describe('core/async/modules/proxy `iterable`', () => {
	let $a;

	beforeEach(() => {
		$a = new Async();
	});

	it('for await of loop on async iterable', async () => {
		const iter = $a.iterable([1, 2, 3, 4]);

		let i = 0;
		for await (const item of iter) {
			expect(item).toEqual(++i);
		}
	});

	it('simple async iterator from array', async () => {
		const asyncIter = $a.iterable([1, 2, 3])[Symbol.asyncIterator]();

		expect(await asyncIter.next()).toEqual({done: false, value: 1});
	});

	it('simple async iterator', async () => {
		const asyncIter = $a.iterable(objWithAsyncIterator)[Symbol.asyncIterator]();

		expect(await asyncIter.next()).toEqual({done: false, value: 1});
	});

	it('cancel async iterator', async () => {
		const iterable = $a.iterable(objWithAsyncIterator);
		const asyncIter = iterable[Symbol.asyncIterator]();
		expect(await asyncIter.next()).toEqual({done: false, value: 1});

		$a.cancelIterable(iterable);

		expect(await asyncIter.next()).toEqual({done: true, value: undefined});
	});

	it('cancel not started async iterator', async () => {
		const iterable = $a.iterable(objWithAsyncIterator);
		const asyncIter = iterable[Symbol.asyncIterator]();

		$a.cancelIterable(iterable);

		expect(await asyncIter.next()).toEqual({done: true, value: undefined});
	});

	it('suspend and unsuspend async iterator', async () => {
		const iterable = $a.iterable(objWithAsyncIterator);
		const asyncIter = iterable[Symbol.asyncIterator]();

		expect(await asyncIter.next()).toEqual({done: false, value: 1});

		const nextIter = asyncIter.next();
		$a.suspendIterable(iterable);

		await $a.sleep(200);
		await expectToBePending(nextIter);

		$a.unsuspendIterable(iterable);
		await expectToBeResolved(nextIter);

		expect(await nextIter).toEqual({done: false, value: 2});
	});
});
