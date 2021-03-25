/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { asyncLocal } from 'core/kv-storage';

import { StorageManager } from 'core/cache/decorators/persistent/helpers';

describe('core/cache/decorators/persistent', () => {
	describe('StorageManager', () => {
		it('default methods should work', async (done) => {
			const wrapper = new StorageManager(asyncLocal);

			await asyncLocal.set('baz', true);
			wrapper.set('foo', true);
			wrapper.set('bar', true);
			wrapper.remove('baz');

			setTimeout(async () => {
				const foo = await asyncLocal.has('foo');
				const bar = await asyncLocal.has('bar');
				const baz = await asyncLocal.has('baz');

				expect(foo).toBe(true);
				expect(bar).toBe(true);
				expect(baz).toBe(false);

				done();
			}, 10);
		});

		it('should collapse change of same values', (done) => {
			const wrapper = new StorageManager(asyncLocal);

			wrapper.set('foo', 1);
			wrapper.set('foo', 2);

			spyOn(asyncLocal, 'set').and.callThrough();

			setTimeout(async () => {
				const foo = await asyncLocal.get('foo');

				expect(foo).toBe(2);
				expect(asyncLocal.set.calls.first().args).toEqual(['foo', 2]);

				done();
			}, 10);
		});

		it('should call callback only if action was happend', (done) => {
			const results = {
				firstCall: false,
				secondCall: false
			};

			const wrapper = new StorageManager(asyncLocal);

			wrapper.set('foo', 1, () => results.firstCall = true);
			wrapper.set('foo', 2, () => results.secondCall = true);

			setTimeout(() => {
				expect(results).toEqual({
					firstCall: false,
					secondCall: true
				});

				done();
			}, 10);
		});
	});
});
