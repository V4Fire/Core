/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/function/curry', () => {
	it('curry', () => {
		const multiply = (a, b, c) => a * b * c;
		expect(multiply.curry()(2)(3, 4)).toBe(24);
	});

	it('curry with gaps', () => {
		const multiply = (a, b, c) => a * b * c;
		expect(multiply.curry()(Function.__)(2)(3, 4)).toBe(24);
	});

	it('Function.curry', () => {
		const multiply = (a, b, c) => a * b * c;
		expect(Function.curry(multiply)(2)(3, 4)).toBe(24);
	});
});
