/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import LinkedList from './linked-list';

describe('core/linked-list', () => {
	it('base linked list behaviour', () => {
		const
			list = new LinkedList();

		list.push(1);

		expect(list.length).toBe(1);
		expect(list.head.data).toBe(1);
		expect(list.tail.data).toBe(1);
		expect(list.head === list.tail).toBe(true);

		list.push(2);
		expect(list.length).toBe(2);

		expect(list.pop().data).toBe(2);
		expect(list.length).toBe(1);

		expect(list.pop().data).toBe(1);
		expect(list.length).toBe(0);
		expect(list.head).toBe(null);
		expect(list.tail).toBe(null);

		list.unshift(3);
		expect(list.length).toBe(1);

		list.unshift(4);
		expect(list.length).toBe(2);

		expect(list.shift().data).toBe(4);

		expect(list.length).toBe(1);
		expect(list.head.data).toBe(3);
		expect(list.tail.data).toBe(3);

		expect(list.shift().data).toBe(3);
		expect(list.length).toBe(0);
		expect(list.head).toBe(null);
		expect(list.tail).toBe(null);

		list.unshift(3);
		list.clear();

		expect(list.length).toBe(0);
		expect(list.head).toBe(null);
		expect(list.tail).toBe(null);
	});

	it('iterating a linked list', () => {
		const
			list = new LinkedList();

		list.push(1);
		list.push(2);
		list.push(3);

		expect([...list]).toEqual([1, 2, 3]);
	});
});
