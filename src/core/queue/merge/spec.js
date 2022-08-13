/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import MergeQueue from 'core/queue/merge';

describe('core/queue/merge', () => {
	it('simple usage', () => {
		const
			queue = new MergeQueue();

		expect(queue.push(3)).toBe(1);
		expect(queue.push(3)).toBe(1);
		expect(queue.push(4)).toBe(2);
		expect(queue.push(4)).toBe(2);

		expect(queue.head).toBe(3);
		expect(queue.length).toBe(2);

		expect(queue.pop()).toBe(3);

		expect(queue.head).toBe(4);
		expect(queue.length).toBe(1);
	});

	it('alternative API', () => {
		const
			queue = new MergeQueue();

		expect(queue.unshift(3)).toBe(1);
		expect(queue.unshift(3)).toBe(1);
		expect(queue.unshift(4)).toBe(2);
		expect(queue.unshift(4)).toBe(2);

		expect(queue.head).toBe(3);
		expect(queue.length).toBe(2);

		expect(queue.shift()).toBe(3);

		expect(queue.head).toBe(4);
		expect(queue.length).toBe(1);
	});

	it('clearing of a queue', () => {
		const
			queue = new MergeQueue();

		expect(queue.push(3)).toBe(1);
		expect(queue.push(4)).toBe(2);

		queue.clear();

		expect(queue.head).toBeUndefined();
		expect(queue.length).toBe(0);
	});

	it('cloning a queue', () => {
		const
			queue = new MergeQueue(),
			item = {a: 1};

		queue.push(item);

		const
			clonedQueue = queue.clone();

		expect(queue !== clonedQueue).toBe(true);
		expect(queue.innerQueue !== clonedQueue.innerQueue).toBe(true);

		expect(queue.head).toBe(item);
		expect(queue.length).toBe(1);
		expect(queue.pop()).toBe(item);

		expect(clonedQueue.head).toBe(item);
		expect(clonedQueue.length).toBe(1);
		expect(clonedQueue.pop()).toBe(item);
	});

	it('iterating a queue', () => {
		const
			queue = new MergeQueue();

		queue.push(1);
		queue.push(2);
		queue.push(3);

		expect([...queue]).toEqual([1, 2, 3]);
	});
});
