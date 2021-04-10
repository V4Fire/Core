/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import wrapEmit from 'core/cache/decorators/emit';
import SimpleCache from 'core/cache/simple';
import RestrictedCache from 'core/cache/restricted';

describe('core/cache/decorators/emit', () => {
	describe('remove method', () => {
		it('emit remove event if remove was called, and dont emit if original method was called', () => {
			const cache = new SimpleCache(),
				// Original method
				{remove} = wrapEmit(cache);

			const memory = [];

			cache.eventEmitter.on('remove', (key) => {
				memory.push(key);
			});

			cache.set('foo', 1);
			cache.remove('foo');
			expect(memory[0]).toBe('foo');

			cache.set('bar', 1);
			remove('bar');
			expect(memory[1]).toBe(undefined);
		});

		it('example with restricted cache', () => {
			const cache = new RestrictedCache(1);
			wrapEmit(cache);

			const memory = [];

			cache.eventEmitter.on('remove', (key) => {
				memory.push(key);
			});

			cache.set('foo', 1);
			cache.set('bar', 1);
			expect(memory).toEqual(['foo']);
		});
	});
});
