
/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/object/metrics/size', () => {
	it('array', () => {
		expect(Object.size([1, 2, 3])).toBe(3);
	});

	it('object', () => {
		expect(Object.size({a: 1})).toBe(1);
	});

	it('map', () => {
		expect(Object.size(new Map([[0, 1]]))).toBe(1);
	});

	it('set', () => {
		expect(Object.size(new Set([1, 2]))).toBe(2);
	});

	it('function', () => {
		expect(Object.size(foo)).toBe(2);

		function foo(a, b) {
			return a + b;
		}
	});

	it('string', () => {
		expect(Object.size('123')).toBe(3);
	});

	it('number', () => {
		expect(Object.size(2)).toBe(2);
		expect(Object.size(NaN)).toBe(0);
		expect(Object.size(Infinity)).toBe(Infinity);
	});

	it('iterable', () => {
		expect(Object.size([1, 2].values())).toBe(2);
	});

	it('null', () => {
		expect(Object.size(null)).toBe(0);
		expect(Object.size(undefined)).toBe(0);
	});
});
