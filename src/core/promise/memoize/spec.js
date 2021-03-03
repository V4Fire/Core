/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { memoize } from 'core/promise/memoize';

describe('core/promise/memoize/memoize', () => {
	it('simple memoization', async () => {
		const promise = memoize(new Promise((r) => setTimeout(r, 100)));
		await promise;

		let i = 2;
		promise.then(() => i *= 3);
		i += 1;

		expect(i).toBe(7);
	});

	it('memoization with a factory', async () => {
		const promise = memoize(() => new Promise((r) => setTimeout(r, 100)));
		await promise;

		let i = 2;
		promise.then(() => i *= 3);
		i += 1;

		expect(i).toBe(7);
	});

	it('memoization by a key', async () => {
		await memoize('bla', new Promise((r) => setTimeout(r, 100)));

		let i = 2;
		memoize('bla', new Promise((r) => setTimeout(r, 100))).then(() => i *= 3);
		i += 1;

		expect(i).toBe(7);
	});

	it('memoization by a key and factory', async () => {
		await memoize('bla', () => new Promise((r) => setTimeout(r, 100)));

		let i = 2;
		memoize('bla', () => new Promise((r) => setTimeout(r, 100))).then(() => i *= 3);
		i += 1;

		expect(i).toBe(7);
	});
});
