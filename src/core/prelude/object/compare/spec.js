/* eslint-disable @typescript-eslint/no-extraneous-class */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/object/compare', () => {
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
		expect(Object.fastCompare([], [1])).toBeTrue();
		expect(Object.fastCompare([0], {0: 0, length: 1})).toBeFalse();
	});

	it('comparing of objects', () => {
		expect(Object.fastCompare({}, {})).toBeTrue();
		expect(Object.fastCompare({length: 0}, {length: 0})).toBeTrue();
		expect(Object.fastCompare({a: {b: 2}}, {a: {b: 2}})).toBeTrue();
	});

	it('comparing of dates', () => {
		expect(Object.fastCompare(new Date(), new Date())).toBeTrue();
	});

	it('comparing of regexps', () => {
		expect(Object.fastCompare(/\d/, /\d/)).toBeTrue();
	});

	it('comparing of map-s', () => {
		expect(Object.fastCompare(new Map(), new Map())).toBeTrue();
		expect(Object.fastCompare(new Map([[1, 0]]), new Map([[1, 0]]))).toBeTrue();

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
});
