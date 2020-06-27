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

	it('once with arguments', () => {
		const fn = ((i) => i).once();
		expect(fn(1)).toBe(1);
		expect(fn(2)).toBe(1);
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
