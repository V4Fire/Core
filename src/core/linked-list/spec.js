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
		expect(list.first).toBe(1);
		expect(list.last).toBe(1);
		expect(list.first === list.last).toBe(true);

		list.push(2);
		expect(list.length).toBe(2);

		expect(list.pop()).toBe(2);
		expect(list.length).toBe(1);

		expect(list.pop()).toBe(1);
		expect(list.length).toBe(0);
		expect(list.first).toBeUndefined();
		expect(list.last).toBeUndefined();

		list.unshift(3);
		expect(list.length).toBe(1);

		list.unshift(4);
		expect(list.length).toBe(2);

		expect(list.shift()).toBe(4);

		expect(list.length).toBe(1);
		expect(list.first).toBe(3);
		expect(list.last).toBe(3);

		expect(list.shift()).toBe(3);
		expect(list.length).toBe(0);
		expect(list.first).toBeUndefined();
		expect(list.last).toBeUndefined();

		list.unshift(3);
		list.clear();

		expect(list.length).toBe(0);
		expect(list.first).toBeUndefined();
		expect(list.last).toBeUndefined();
	});

	it('creating a linked list from iterable', () => {
		const
			list = new LinkedList([1, 2, 3]);

		expect(list.first).toBe(1);
		expect(list.last).toBe(3);
		expect([...list]).toEqual([1, 2, 3]);
	});

	it('iterating a linked list', () => {
		const
			list = new LinkedList();

		list.push(1);
		list.push(2);
		list.push(3);

		expect([...list]).toEqual([1, 2, 3]);
	});

	it('check if list contains value', () => {
		const
			list = new LinkedList();

		list.push(1);
		list.push(2);
		list.push(3);

		expect(list.has(2)).toBe(true);
		expect(list.has(10)).toBe(false);
	});

	it('reverse iterating a linked list', () => {
		const
			list = new LinkedList();

		list.push(1);
		list.push(2);
		list.push(3);

		expect([...list.reverse()]).toEqual([3, 2, 1]);
	});

	it('cloning a linked list', () => {
		const
			list = new LinkedList();

		list.push(1);
		list.push(2);

		const
			clonedList = list.clone();

		expect(list !== clonedList).toBe(true);

		expect(list.first).toBe(1);
		expect(list.last).toBe(2);
		expect(list.length).toBe(2);
		expect(list.pop()).toBe(2);

		expect(clonedList.first).toBe(1);
		expect(clonedList.last).toBe(2);
		expect(clonedList.length).toBe(2);
		expect(clonedList.shift()).toBe(1);
	});
});
