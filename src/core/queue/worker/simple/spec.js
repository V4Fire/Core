/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import WorkerQueue from 'core/queue/worker/simple';

describe('core/queue/worker/simple', () => {
	it('simple usage', async () => {
		const
			res = [];

		const queue = new WorkerQueue((task) => {
			res.push(task.a);
			return Promise.resolve();

		}, {
			concurrency: 2,
			refreshInterval: 50
		});

		expect(queue.push({a: 1}))
			.toBeInstanceOf(Promise);

		queue.push({a: 2});
		queue.push({a: 3});

		expect(queue.length).toBe(1);
		expect(queue.head).toEqual({a: 3});
		expect(queue.pop()).toEqual({a: 3});

		await queue.push({a: 4}).then(() => {
			expect(queue.length).toBe(0);
			expect(res).toEqual([1, 2, 4]);
		});
	});

	it('alternative API', async () => {
		const
			res = [];

		const queue = new WorkerQueue((task) => {
			res.push(task.a);
			return Promise.resolve();

		}, {
			concurrency: 2,
			refreshInterval: 50,
			hashFn: (task) => JSON.stringify(task)
		});

		expect(queue.unshift({a: 1}))
			.toBeInstanceOf(Promise);

		queue.unshift({a: 2});
		queue.unshift({a: 3});

		expect(queue.length).toBe(1);
		expect(queue.head).toEqual({a: 3});
		expect(queue.shift()).toEqual({a: 3});

		await queue.unshift({a: 4}).then(() => {
			expect(queue.length).toBe(0);
			expect(res).toEqual([1, 2, 4]);
		});
	});

	it('clearing of a queue', () => {
		const
			res = [];

		const queue = new WorkerQueue((task) => {
			res.push(task.a);
			return Promise.resolve();

		}, {concurrency: 1});

		queue.unshift({a: 1});
		queue.unshift({a: 2});
		queue.unshift({a: 3});

		expect(queue.length).toBe(2);

		queue.clear();

		expect(queue.length).toBe(0);
		expect(res).toEqual([1]);
	});
});
