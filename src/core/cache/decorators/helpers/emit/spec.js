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

describe('core/cache/decorators/helpers/emit', () => {
	describe('subscribe', () => {
		it('emit events only to top', () => {
			function CreateLevel(level) {
				this.level = level;
				this.remove = () => null;
			}

			const
				level1 = new CreateLevel(1),
				level2 = new CreateLevel(2),
				level3 = new CreateLevel(3);

			const memory = [];

			Object.setPrototypeOf(level2, level1);
			Object.setPrototypeOf(level3, level2);
			const {subscribe: subscribe1} = wrapEmit(level1);
			const {subscribe: subscribe2} = wrapEmit(level2);

			subscribe1('remove', level2, () => memory.push('level1'));
			subscribe2('remove', level3, () => memory.push('level2'));

			level1.remove();
			expect(memory).toEqual(['level1', 'level2']);
			memory.length = 0;

			level2.remove();
			expect(memory).toEqual(['level2']);
		});
	});

	describe('remove method', () => {
		it('emit remove event if remove was called, and dont emit if original method was called', () => {
			const cache = new SimpleCache(),
				// Original method
				{remove} = wrapEmit(cache);

			const memory = [];

			cache.eventEmitter.on('remove', (...args) => {
				memory.push(args);
			});

			cache.set('foo', 1);
			cache.remove('foo');
			expect(memory[0]).toEqual([cache, ['foo']]);

			cache.set('bar', 1);
			remove('bar');
			expect(memory[1]).toBe(undefined);
		});

		it('example with restricted cache', () => {
			const cache = new RestrictedCache(1);
			wrapEmit(cache);

			const memory = [];

			cache.eventEmitter.on('remove', (...args) => {
				memory.push(args);
			});

			cache.set('foo', 1);
			cache.set('bar', 1);
			expect(memory).toEqual([[cache, ['foo']]]);
		});
	});
});
