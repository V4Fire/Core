/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import OrderQueue from 'core/queue/order';

describe('core/queue/order', () => {
	it('should put and remove elements from the queue in the correct order', () => {
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

	it('should return the queue length', () => {
		const
			queue = new OrderQueue((a, b) => a - b);

		queue.push(7);
		queue.push(2);
		queue.push(4);
		expect(queue.length).toBe(3);

		queue.pop();
		expect(queue.length).toBe(2);
	});

	it('should implement the alternative API', () => {
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

	it('should implement the iterable API', () => {
		const
			queue = new OrderQueue((a, b) => a - b);

		queue.push(5);
		queue.push(1);
		queue.push(7);

		expect(Object.isIterator(queue.values())).toBeTrue();
		expect([...queue.values()]).toEqual([7, 5, 1]);
		expect([...queue]).toEqual([7, 5, 1]);
	});

	it('calling `clone` should clone the queue', () => {
		const
			queue = new OrderQueue((a, b) => a - b);

		queue.push(3);

		const
			clonedQueue = queue.clone();

		expect(queue.head).toBe(3);
		expect(queue.length).toBe(1);
		expect(queue.pop()).toBe(3);

		expect(clonedQueue.head).toBe(3);
		expect(clonedQueue.length).toBe(1);
		expect(clonedQueue.pop()).toBe(3);

		expect(queue.comparator === clonedQueue.comparator).toBe(true);
	});

	it('calling `clear` should clear the queue', () => {
		const
			queue = new OrderQueue((a, b) => a - b);

		queue.push(3);
		queue.push(4);

		queue.clear();

		expect(queue.head).toBeUndefined();
		expect(queue.length).toBe(0);
	});
});
