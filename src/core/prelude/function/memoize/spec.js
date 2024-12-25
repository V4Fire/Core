/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/function/memoize', () => {
	it('`memoize`', () => {
		const
			rand = Math.random.memoize(),
			res = rand();

		expect(Object.isNumber(res)).toBe(true);
		expect(rand()).toBe(res);
		expect(rand()).toBe(res);
	});

	it('`memoize` with arguments', () => {
		const fn = ((i) => i).memoize();
		expect(fn(1)).toBe(1);
		expect(fn(2)).toBe(1);
	});

	it('`Function.memoize`', () => {
		const
			rand = Function.memoize(Math.random),
			res = rand();

		expect(Object.isNumber(res)).toBe(true);
		expect(rand()).toBe(res);
		expect(rand()).toBe(res);
	});
});
