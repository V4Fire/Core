/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SimpleQueue from 'core/queue/simple';

describe('core/queue/simple', () => {
	it('should put and remove elements from the queue in the correct order', () => {
		const
			queue = new SimpleQueue();

		expect(queue.push(3)).toBe(1);
		expect(queue.push(4)).toBe(2);
		expect(queue.head).toBe(3);

		expect(queue.pop()).toBe(3);
		expect(queue.head).toBe(4);

		expect(queue.pop()).toBe(4);
		expect(queue.push(5)).toBe(1);
		expect(queue.push(6)).toBe(2);
		expect(queue.push(7)).toBe(3);
		expect(queue.head).toBe(5);

		expect(queue.pop()).toBe(5);
		expect(queue.head).toBe(6);

		expect(queue.pop()).toBe(6);
		expect(queue.push(8)).toBe(2);
		expect(queue.push(9)).toBe(3);
		expect(queue.head).toBe(7);
	});

	it('should return the queue length', () => {
		const
			queue = new SimpleQueue();

		queue.push(3);
		queue.push(4);
		expect(queue.length).toBe(2);

		queue.pop();
		expect(queue.length).toBe(1);

		queue.pop();
		expect(queue.length).toBe(0);

		queue.push(5);
		queue.push(6);
		queue.push(7);

		expect(queue.length).toBe(3);
	});

	it('should implement the alternative API', () => {
		const
			queue = new SimpleQueue();

		expect(queue.unshift(3)).toBe(1);
		expect(queue.unshift(4)).toBe(2);

		expect(queue.head).toBe(3);
		expect(queue.length).toBe(2);

		expect(queue.shift()).toBe(3);

		expect(queue.head).toBe(4);
		expect(queue.length).toBe(1);
	});

	it('should implement the iterable API', () => {
		const
			queue = new SimpleQueue();

		queue.push(1);
		queue.push(2);
		queue.push(3);

		expect(Object.isIterator(queue.values())).toBe(true);
		expect([...queue.values()]).toEqual([1, 2, 3]);
		expect([...queue]).toEqual([1, 2, 3]);
	});

	it('calling `clone` should clone the queue', () => {
		const
			el = {a: 1},
			queue = new SimpleQueue();

		queue.push(el);

		const
			clonedQueue = queue.clone();

		expect(queue !== clonedQueue).toBe(true);
		expect(queue['innerQueue'] !== clonedQueue['innerQueue']).toBe(true);

		expect(queue.head).toBe(el);
		expect(queue.length).toBe(1);
		expect(queue.pop()).toBe(el);

		expect(clonedQueue.head).toBe(el);
		expect(clonedQueue.length).toBe(1);
		expect(clonedQueue.pop()).toBe(el);
	});

	it('calling `clear` should clear the queue', () => {
		const
			queue = new SimpleQueue();

		queue.push(3);
		queue.push(4);
		queue.clear();

		expect(queue.head).toBeUndefined();
		expect(queue.length).toBe(0);
	});
});
