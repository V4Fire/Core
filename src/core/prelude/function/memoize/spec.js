/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/function/memoize', () => {
	it('once', () => {
		const
			rand = Math.random.once(),
			res = rand();

		expect(Object.isNumber(res)).toBeTrue();
		expect(rand()).toBe(res);
		expect(rand()).toBe(res);
	});

	it('Function.once', () => {
		const
			rand = Function.once(Math.random),
			res = rand();

		expect(Object.isNumber(res)).toBeTrue();
		expect(rand()).toBe(res);
		expect(rand()).toBe(res);
	});
});
