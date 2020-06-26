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
});
