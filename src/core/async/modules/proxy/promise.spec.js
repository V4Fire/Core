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
		await $a.promise(Promise.resolve('All fine')).then((msg) => expect(msg).toBe('All fine'));
	});

	it('chained promise wrapper with the resolved promise', async () => {
		await $a.promise(Promise.resolve('All fine'))
			.catch(() => 'Boom!')
			.then((msg) => expect(msg).toBe('All fine'));
	});

	it('simple promise wrapper with the rejected promise', async () => {
		await $a.promise(Promise.reject('Boom!')).catch((err) => {
			expect(err).toBe('Boom!');
		});
	});

	it('chained promise wrapper with the rejected promise', async () => {
		await $a.promise(Promise.reject('Boom!'))
			.catch((err) => {
				expect(err).toBe('Boom!');
				return 'All fine';
			})

			.then((msg) => expect(msg).toBe('All fine'));
	});
});
