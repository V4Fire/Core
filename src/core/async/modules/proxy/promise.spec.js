/* eslint-disable prefer-promise-reject-errors, @typescript-eslint/no-throw-literal */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Async from 'core/async';

describe('core/async/modules/proxy/promise', () => {
	const $a = new Async();

	it('simple promise wrapper with the resolved promise', async () => {
		expect(await $a.promise(Promise.resolve('All fine'))).toBe('All fine');
	});

	it('chained promise wrapper with the resolved promise', async () => {
		expect(await $a.promise(Promise.resolve('All fine')).catch(() => 'Boom!')).toBe('All fine');
	});

	it('simple promise wrapper with the rejected promise', async () => {
		try {
			await $a.promise(Promise.reject('Boom!'));
			throw 'Oops';

		} catch (err) {
			expect(err).toBe('Boom!');
		}
	});

	it('chained promise wrapper with the rejected promise', async () => {
		const res = $a.promise(Promise.reject('Boom!')).catch((err) => {
			expect(err).toBe('Boom!');
			return 'All fine';
		});

		expect(await res).toBe('All fine');
	});
});
