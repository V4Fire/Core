/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/function/curry', () => {
	it('curry', () => {
		const
			multiply = (a, b, c) => a * b * c,
			c = multiply.curry();

		expect(c(2)(3, 4)).toBe(24);
		expect(c(3)(2, 2)).toBe(12);

		const
			c2 = c(4);

		expect(c2(2)(2)).toBe(16);

		const
			c3 = c2.curry();

		expect(c3(1)(2)).toBe(8);
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
