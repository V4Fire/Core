/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SimpleQueue from 'core/queue/simple';

describe('core/queue/simple', () => {
	it('simple usage', () => {
		const
			queue = new SimpleQueue();

		expect(queue.push(3)).toBe(1);
		expect(queue.push(4)).toBe(2);

		expect(queue.head).toBe(3);
		expect(queue.length).toBe(2);

		expect(queue.pop()).toBe(3);

		expect(queue.head).toBe(4);
		expect(queue.length).toBe(1);

		expect(queue.pop()).toBe(4);
		expect(queue.length).toBe(0);

		expect(queue.push(5)).toBe(1);
		expect(queue.push(6)).toBe(2);
		expect(queue.push(7)).toBe(3);

		expect(queue.head).toBe(5);
		expect(queue.length).toBe(3);

		expect(queue.pop()).toBe(5);

		expect(queue.head).toBe(6);
		expect(queue.length).toBe(2);

		expect(queue.pop()).toBe(6);

		expect(queue.push(8)).toBe(2);
		expect(queue.push(9)).toBe(3);

		expect(queue.head).toBe(7);
		expect(queue.length).toBe(3);
	});

	it('alternative API', () => {
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

	it('clearing of a queue', () => {
		const
			queue = new SimpleQueue();

		expect(queue.push(3)).toBe(1);
		expect(queue.push(4)).toBe(2);

		queue.clear();

		expect(queue.head).toBeUndefined();
		expect(queue.length).toBe(0);
	});
});
