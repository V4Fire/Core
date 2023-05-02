/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Async from 'core/async';
import flat from 'core/async/modules/flat';
import { expectType } from 'core/async/modules/flat/interface/expect-type';

describe('core/async/modules/flat', () => {
	it('returns the last value from chain and infers its type', async () => {
		const data = Promise.resolve({
			foo: {
				bar: [(arg: number) => arg * 2]
			}
		});

		const val = await flat(data)
			.foo
			.bar
			.at(0)?.(21)
			.toString()
			.split('');

		expect(val).toEqual(['4', '2']);
		expectType<CanUndef<string[]>, typeof val>();
	});

	it('infers type of overloaded function', async () => {
		function fn(arg: number): string;
		function fn(arg: string): Promise<number>;
		function fn(arg: string | number): Promise<number> | string {
			return Object.isString(arg) ? Promise.resolve(Number(arg)) : String(arg);
		}

		const
			f = flat(fn),
			s1 = await f(1).toUpperCase(),
			s2 = await f('1').toFixed(1);

		expectType<string, typeof s1>();
		expectType<string, typeof s2>();

		expect(s1).toBe('1');
		expect(s2).toBe('1.0');
	});

	it('throws expection or rejects a promise if trying to access an undefined property', async () => {
		const thenHandler = jest.fn();
		const promise = flat([1])[10]
			.toString()
			.then(thenHandler)
			.catch((e) => Promise.reject(e.message));

		await expect(promise).rejects.toBe("Cannot read properties of undefined (reading 'toString')");
		expect(thenHandler).not.toBeCalled();
	});

	it('works with `Promise.all`', async () => {
		const $a = new Async();
		const flatten = flat(async () => {
			await $a.sleep(50);

			return {
				foo: {bar: 'bar'},
				baz: async () => {
					await $a.sleep(50);
					return ['baz'];
				}
			};
		})();

		const
			{bar} = flatten.foo,
			baz = flatten.baz()[0],
			values = await Promise.all([bar, baz]);

		expect(values).toEqual(['bar', 'baz']);
		expectType<[string, string], typeof values>();
	});
});
