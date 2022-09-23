/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import LinkedList from 'core/linked-list';

describe('core/linked-list', () => {
	it('should return the first value from the list', () => {
		const
			list = new LinkedList([1, 2, 3]);

		expect(list.first).toBe(1);

		list.shift();
		expect(list.first).toBe(2);

		list.unshift(0);
		expect(list.first).toBe(0);
	});

	it('should return the last value from the list', () => {
		const
			list = new LinkedList([1, 2, 3]);

		expect(list.last).toBe(3);

		list.pop();
		expect(list.last).toBe(2);

		list.push(4);
		expect(list.last).toBe(4);
	});

	it('should return the list length', () => {
		const
			list = new LinkedList([1, 2, 3]);

		expect(list.length).toBe(3);

		list.pop();
		expect(list.length).toBe(2);

		list.push(4);
		expect(list.length).toBe(3);
	});

	it('should implement Array-Like add/remove API', () => {
		const
			list = new LinkedList([1, 2, 3]);

		expect(list.pop()).toBe(3);
		expect(list.shift()).toBe(1);

		expect(list.push(4)).toBe(list.length);
		expect(list.pop()).toBe(4);

		expect(list.unshift(0)).toBe(list.length);
		expect(list.shift()).toBe(0);
	});

	it('should implement Array-Like slice API', () => {
		const
			a = {},
			list = new LinkedList([a, 2, 3]);

		expect(list.slice()).not.toBe(list);
		expect([...list.slice()]).toEqual([a, 2, 3]);
		expect(list.slice().first).toBe(a);

		expect([...list.slice(1)]).toEqual([2, 3]);
		expect([...list.slice(-1)]).toEqual([3]);

		expect([...list.slice(0, -1)]).toEqual([a, 2]);
		expect([...list.slice(0, -12)]).toEqual([]);

		expect([...list.slice(1, 2)]).toEqual([2]);
		expect([...list.slice(2, 1)]).toEqual([]);
	});

	it('should implement Array-Like includes API', () => {
		const
			list = new LinkedList([-0, 1, NaN, 3]);

		expect(list.includes(0)).toBe(true);
		expect(list.includes(1)).toBe(true);
		expect(list.includes(NaN)).toBe(true);
		expect(list.includes(10)).toBe(false);
	});

	it('should implement the iterable API', () => {
		const
			list = new LinkedList([1, 2, 3]);

		expect(Object.isIterable(list)).toBe(true);
		expect(Object.isIterator(list.values())).toBe(true);

		expect([...list]).toEqual([1, 2, 3]);
		expect([...list.values()]).toEqual([1, 2, 3]);
	});

	it('calling `reverse` must return a reversed iterator', () => {
		const
			list = new LinkedList([1, 2, 3]);

		expect(Object.isIterator(list.reverse())).toBe(true);
		expect([...list.reverse()]).toEqual([3, 2, 1]);
		expect([...new LinkedList(list.reverse())]).toEqual([3, 2, 1]);
	});

	it('calling `clear` should clear the list', () => {
		const
			list = new LinkedList([1, 2, 3]);

		list.clear();

		expect(list.first).toBeUndefined();
		expect(list.last).toBeUndefined();
		expect(list.length).toBe(0);

		expect([...list]).toEqual([]);
		expect([...list.reverse()]).toEqual([]);
	});
});
