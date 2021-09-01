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
		expect(Object.fastCompare(1, 1)).toBeTrue();
		expect(Object.fastCompare(0, null)).toBeFalse();
		expect(Object.fastCompare(0, '')).toBeFalse();
	});

	it('comparing of different types', () => {
		expect(Object.fastCompare(1, {})).toBeFalse();
		expect(Object.fastCompare([], new Date())).toBeFalse();

		class Foo1 {}

		class Foo2 {}

		expect(Object.fastCompare(new Foo1(), new Foo2())).toBeFalse();
	});

	it('comparing of arrays', () => {
		expect(Object.fastCompare([], [])).toBeTrue();
		expect(Object.fastCompare([], [1])).toBeFalse();
		expect(Object.fastCompare([0], {0: 0, length: 1})).toBeFalse();
	});

	it('comparing of objects', () => {
		expect(Object.fastCompare({}, {})).toBeTrue();
		expect(Object.fastCompare({length: 0}, {length: 0})).toBeTrue();
		expect(Object.fastCompare({a: {b: 2}}, {a: {b: 2}})).toBeTrue();
		expect(Object.fastCompare({a: {b: 2}}, {a: {b: 3}})).toBeFalse();
	});

	it('comparing of dates', () => {
		const
			date1 = new Date(),
			date2 = new Date(date1.valueOf());

		expect(Object.fastCompare(date1, date2)).toBeTrue();
		expect(Object.fastCompare(date1, new Date(2015, 10, 14))).toBeFalse();
	});

	it('comparing of regexps', () => {
		expect(Object.fastCompare(/\d/, /\d/)).toBeTrue();
		expect(Object.fastCompare(/\d/, /\d+/)).toBeFalse();
	});

	it('comparing of map-s', () => {
		expect(Object.fastCompare(new Map(), new Map())).toBeTrue();
		expect(Object.fastCompare(new Map([[1, 0]]), new Map([[1, 0]]))).toBeTrue();
		expect(Object.fastCompare(new Map([[{a: 1}, {b: 2}]]), new Map([[{a: 1}, {b: 2}]]))).toBeTrue();
		expect(Object.fastCompare(new Map([[1, 0]]), new Map([]))).toBeFalse();
		expect(Object.fastCompare(new Map([[{a: 1}, 1]]), new Map([[{a: 2}, 1]]))).toBeFalse();
		expect(Object.fastCompare(new Map([[{a: 1}, {a: 1}]]), new Map([[{a: 1}, {a: 2}]]))).toBeFalse();
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

		expect(Object.fastCompare(map1, map2)).toBeTrue();
	});

	it('comparing of set-s', () => {
		expect(Object.fastCompare(new Set(), new Set())).toBeTrue();
		expect(Object.fastCompare(new Set([1]), new Set([1]))).toBeTrue();
		expect(Object.fastCompare(new Set([{a: 1}]), new Set([{a: 1}]))).toBeTrue();
		expect(Object.fastCompare(new Set([1]), new Set([1, 2]))).toBeFalse();
		expect(Object.fastCompare(new Set([{a: 1}]), new Set([{b: 2}]))).toBeFalse();
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

		expect(Object.fastCompare(set1, set2)).toBeTrue();
	});

	it('compare overload', () => {
		expect(Object.fastCompare({a: {b: 2}})({a: {b: 2}})).toBeTrue();
		expect(Object.fastCompare({a: {b: 2}})({a: {b: 3}})).toBeFalse();
	});
});

describe('core/prelude/object/compare/fastHash', () => {
	it('object hashes', () => {
		expect(Object.fastHash({a: 1})).toBe('{"a":1}');
		expect(Object.fastHash([1, 2])).toBe('[1,2]');

		const
			date = new Date();

		expect(Object.fastHash(date)).toBe(JSON.stringify(date));
	});

	it('primitive hashes', () => {
		expect(Object.fastHash('')).toBe('""');
		expect(Object.fastHash(null)).toBe('null');
		expect(Object.fastHash(undefined)).toBe('null');
		expect(Object.fastHash(0)).toBe('0');
	});
});
