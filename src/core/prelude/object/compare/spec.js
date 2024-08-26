/* eslint-disable @typescript-eslint/no-extraneous-class */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/object/compare/fastCompare', () => {
	it('comparing of primitives', () => {
		expect(Object.fastCompare(1, 1)).toBe(true);
		expect(Object.fastCompare(0, null)).toBe(false);
		expect(Object.fastCompare(0, '')).toBe(false);
	});

	it('comparing of different types', () => {
		expect(Object.fastCompare(1, {})).toBe(false);
		expect(Object.fastCompare([], new Date())).toBe(false);

		class Foo1 {}

		class Foo2 {}

		expect(Object.fastCompare(new Foo1(), new Foo2())).toBe(false);
	});

	it('comparing of arrays', () => {
		expect(Object.fastCompare([], [])).toBe(true);
		expect(Object.fastCompare([], [1])).toBe(false);
		expect(Object.fastCompare([0], {0: 0, length: 1})).toBe(false);
	});

	it('comparing of objects', () => {
		expect(Object.fastCompare({}, {})).toBe(true);
		expect(Object.fastCompare({length: 0}, {length: 0})).toBe(true);
		expect(Object.fastCompare({a: {b: 2}}, {a: {b: 2}})).toBe(true);
		expect(Object.fastCompare({a: {b: 2}}, {a: {b: 3}})).toBe(false);
	});

	it('comparing of dates', () => {
		const
			date1 = new Date(),
			date2 = new Date(date1.valueOf());

		expect(Object.fastCompare(date1, date2)).toBe(true);
		expect(Object.fastCompare(date1, new Date(2015, 10, 14))).toBe(false);
	});

	it('comparing of regexps', () => {
		expect(Object.fastCompare(/\d/, /\d/)).toBe(true);
		expect(Object.fastCompare(/\d/, /\d+/)).toBe(false);
	});

	it('comparing of map-s', () => {
		expect(Object.fastCompare(new Map(), new Map())).toBe(true);
		expect(Object.fastCompare(new Map([[1, 0]]), new Map([[1, 0]]))).toBe(true);
		expect(Object.fastCompare(new Map([[{a: 1}, {b: 2}]]), new Map([[{a: 1}, {b: 2}]]))).toBe(true);
		expect(Object.fastCompare(new Map([[1, 0]]), new Map([]))).toBe(false);
		expect(Object.fastCompare(new Map([[{a: 1}, 1]]), new Map([[{a: 2}, 1]]))).toBe(false);
		expect(Object.fastCompare(new Map([[{a: 1}, {a: 1}]]), new Map([[{a: 1}, {a: 2}]]))).toBe(false);
	});

	it('comparing of map-s by using `toJSON`', () => {
		const map1 = Object.assign(new Map([[1, 0]]), {
			toJSON() {
				return [...this.values()];
			}
		});

		const map2 = Object.assign(new Map([[1, 0]]), {
			toJSON() {
				return [...this.values()];
			}
		});

		expect(Object.fastCompare(map1, map2)).toBe(true);
	});

	it('comparing of set-s', () => {
		expect(Object.fastCompare(new Set(), new Set())).toBe(true);
		expect(Object.fastCompare(new Set([1]), new Set([1]))).toBe(true);
		expect(Object.fastCompare(new Set([{a: 1}]), new Set([{a: 1}]))).toBe(true);
		expect(Object.fastCompare(new Set([1]), new Set([1, 2]))).toBe(false);
		expect(Object.fastCompare(new Set([{a: 1}]), new Set([{b: 2}]))).toBe(false);
	});

	it('comparing of set-s by using `toJSON`', () => {
		const set1 = Object.assign(new Set([1]), {
			toJSON() {
				return [...this.values()];
			}
		});

		const set2 = Object.assign(new Set([1]), {
			toJSON() {
				return [...this.values()];
			}
		});

		expect(Object.fastCompare(set1, set2)).toBe(true);
	});

	it('compare overload', () => {
		expect(Object.fastCompare({a: {b: 2}})({a: {b: 2}})).toBe(true);
		expect(Object.fastCompare({a: {b: 2}})({a: {b: 3}})).toBe(false);
	});
});

describe('core/prelude/object/compare/fastHash', () => {
	it('object hashes', () => {
		expect(Object.fastHash({a: 1})).toBe('1034b77cc1d846');
		expect(Object.fastHash([1, 2])).toBe('ee379c6e55fbd');
	});

	it('primitive hashes', () => {
		expect(Object.fastHash('')).toBe('bdcb81aee8d83');
		expect(Object.fastHash(null)).toBe('15e0da69fcb93a');
		expect(Object.fastHash(undefined)).toBe('15e0da69fcb93a');
		expect(Object.fastHash(0)).toBe('b2475ab050fb7');
	});
});
