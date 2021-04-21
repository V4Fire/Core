/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import addEmit, { eventEmitterSymbol } from 'core/cache/decorators/helpers/emit';
import SimpleCache from 'core/cache/simple';
import RestrictedCache from 'core/cache/restricted';

describe('core/cache/decorators/helpers/emit', () => {
	describe('subscribe', () => {
		it('emit events only to top', () => {
			function CreateLevel(level) {
				this.level = level;
				this.remove = () => null;
				this.set = () => null;
				this.clear = () => null;
			}

			const
				level1 = new CreateLevel(1),
				level2 = new CreateLevel(2),
				level3 = new CreateLevel(3);

			const memory = [];

			Object.setPrototypeOf(level2, level1);
			Object.setPrototypeOf(level3, level2);
			const {subscribe: subscribe1} = addEmit(level1);
			const {subscribe: subscribe2} = addEmit(level2);

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
			const
				cache = new SimpleCache(),
				// Original method
				{remove} = addEmit(cache);

			const memory = [];

			cache[eventEmitterSymbol].on('remove', (...args) => {
				memory.push(args);
			});

			cache.set('foo', 1);
			cache.remove('foo');
			expect(memory[0]).toEqual([cache, {args: ['foo'], result: 1}]);

			cache.set('bar', 1);
			remove('bar');
			expect(memory[1]).toBe(undefined);
		});

		it('example with restricted cache', () => {
			const cache = new RestrictedCache(1);
			addEmit(cache);

			const memory = [];

			cache[eventEmitterSymbol].on('remove', (...args) => {
				memory.push(args);
			});

			cache.set('foo', 1);
			cache.set('bar', 1);
			expect(memory).toEqual([[cache, {args: ['foo'], result: 1}]]);
		});
	});

	describe('clear method', () => {
		it('clear all', () => {
			const
				cache = new SimpleCache(),
				// Original method
				{clear} = addEmit(cache);

			const memory = [];

			cache[eventEmitterSymbol].on('clear', (...args) => {
				memory.push(args);
			});

			cache.set('foo', 1);
			cache.set('bar', 2);
			cache.clear();
			expect(memory[0]).toEqual([cache, {args: [undefined], result: new Map([['foo', 1], ['bar', 2]])}]);

			cache.set('foo', 1);
			cache.set('bar', 2);
			clear();
			expect(memory[1]).toBe(undefined);
		});

		it('clear with function', () => {
			const cache = new SimpleCache();

			addEmit(cache);

			const
				memory = [],
				clearFunction = (el, key) => key === 'bar';

			cache[eventEmitterSymbol].on('clear', (...args) => {
				memory.push(args);
			});

			cache.set('foo', 1);
			cache.set('bar', 2);
			cache.clear(clearFunction);
			expect(memory[0]).toEqual([cache, {args: [clearFunction], result: new Map([['bar', 2]])}]);
		});
	});

	describe('set method', () => {
		it('set property', () => {
			const
				cache = new SimpleCache(),
				// Original method
				{set} = addEmit(cache);

			const memory = [];

			cache[eventEmitterSymbol].on('set', (...args) => {
				memory.push(args);
			});

			cache.set('foo', 1, {ttl: 100, cacheTTL: 200});
			expect(memory[0]).toEqual([cache, {args: ['foo', 1, {ttl: 100, cacheTTL: 200}], result: 1}]);

			set('bar', 2);
			expect(memory[1]).toEqual(undefined);
		});
	});
});
