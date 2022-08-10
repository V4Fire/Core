/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import OrderQueue from 'core/queue/order';

describe('core/queue/order', () => {
	it('simple usage', () => {
		const
			queue = new OrderQueue((a, b) => a - b);

		expect(queue.push(7)).toBe(1);
		expect(queue.push(2)).toBe(2);
		expect(queue.push(4)).toBe(3);

		expect(queue.head).toBe(7);
		expect(queue.length).toBe(3);

		expect(queue.pop()).toBe(7);

		expect(queue.head).toBe(4);
		expect(queue.length).toBe(2);
	});

	it('alternative API', () => {
		const
			queue = new OrderQueue((a, b) => b - a);

		expect(queue.unshift(7)).toBe(1);
		expect(queue.unshift(2)).toBe(2);
		expect(queue.unshift(4)).toBe(3);

		expect(queue.head).toBe(2);
		expect(queue.length).toBe(3);

		expect(queue.shift()).toBe(2);

		expect(queue.head).toBe(4);
		expect(queue.length).toBe(2);
	});

	it('clearing of a queue', () => {
		const
			queue = new OrderQueue((a, b) => a - b);

		expect(queue.push(3)).toBe(1);
		expect(queue.push(4)).toBe(2);

		queue.clear();

		expect(queue.head).toBeUndefined();
		expect(queue.length).toBe(0);
	});

	it('cloning a queue', () => {
		const
			queue = new OrderQueue((a, b) => a - b);

		queue.push(3);

		const
			clonedQueue = queue.clone();

		expect(queue !== clonedQueue).toBe(true);

		expect(queue.head).toBe(0);
		expect(queue.length).toBe(1);
		expect(queue.pop()).toBe(3);

		expect(clonedQueue.head).toBe(0);
		expect(clonedQueue.length).toBe(1);
		expect(clonedQueue.pop()).toBe(3);

		expect(queue.comparator === clonedQueue.comparator).toBe(true);
	});
});
