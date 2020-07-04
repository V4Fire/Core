/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/number/rounding', () => {
	it('floor', () => {
		expect(1.4.floor()).toBe(1);
		expect(1.6.floor()).toBe(1);
		expect(1.66.floor(1)).toBe(1.6);
		expect(1.654.floor(2)).toBe(1.65);
	});

	it('Number.floor', () => {
		expect(Number.floor(1.4, 0)).toBe(1);
		expect(Number.floor(1.66, 1)).toBe(1.6);
		expect(Number.floor(2)(1.654)).toBe(1.65);
	});

	it('round', () => {
		expect(1.4.round()).toBe(1);
		expect(1.6.round()).toBe(2);
		expect(1.66.round(1)).toBe(1.7);
		expect(1.654.round(2)).toBe(1.65);
	});

	it('Number.round', () => {
		expect(Number.round(1.4, 0)).toBe(1);
		expect(Number.round(1.66, 1)).toBe(1.7);
		expect(Number.round(2)(1.654)).toBe(1.65);
	});

	it('ceil', () => {
		expect(1.4.ceil()).toBe(2);
		expect(1.6.ceil()).toBe(2);
		expect(1.66.ceil(1)).toBe(1.7);
		expect(1.654.ceil(2)).toBe(1.66);
	});

	it('Number.ceil', () => {
		expect(Number.ceil(1.4, 0)).toBe(2);
		expect(Number.ceil(1.66, 1)).toBe(1.7);
		expect(Number.ceil(2)(1.654)).toBe(1.66);
	});
});
