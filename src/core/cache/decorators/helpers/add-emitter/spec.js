/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import addEmitter, { eventEmitter } from 'core/cache/decorators/helpers/add-emitter';

import SimpleCache from 'core/cache/simple';
import RestrictedCache from 'core/cache/restricted';

describe('core/cache/decorators/helpers/add-emitter', () => {
	describe('subscribe', () => {
		it('emits events only to top', () => {
			function CreateLevel(level) {
				this.level = level;
				this.remove = () => null;
				this.set = () => null;
				this.clear = () => null;
				this.clone = () => null;
			}

			const
				level1 = new CreateLevel(1),
				level2 = new CreateLevel(2),
				level3 = new CreateLevel(3);

			const memory = [];

			Object.setPrototypeOf(level2, level1);
			Object.setPrototypeOf(level3, level2);

			const {subscribe: subscribe1} = addEmitter(level1);
			const {subscribe: subscribe2} = addEmitter(level2);
			const {subscribe: subscribe3} = addEmitter(level3);

			subscribe1('remove', level1, () => memory.push('level1'));
			subscribe2('remove', level2, () => memory.push('level2'));
			subscribe3('remove', level3, () => memory.push('level3'));

			level1.remove();
			expect(memory).toEqual(['level1', 'level2', 'level3']);
			memory.length = 0;

			level2.remove();
			expect(memory).toEqual(['level2', 'level3']);
		});
	});

	describe('remove', () => {
		it("emits a remove event if `remove` was called and didn't emit if the original method was called", () => {
			const
				cache = new SimpleCache(),
				{remove} = addEmitter(cache);

			const memory = [];

			cache[eventEmitter].on('remove', (...args) => {
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
			addEmitter(cache);

			const memory = [];

			cache[eventEmitter].on('remove', (...args) => {
				memory.push(args);
			});

			cache.set('foo', 1);
			cache.set('bar', 1);
			expect(memory).toEqual([[cache, {args: ['foo'], result: 1}]]);
		});
	});

	describe('clear', () => {
		it('clears all', () => {
			const
				cache = new SimpleCache(),
				{clear} = addEmitter(cache);

			const memory = [];

			cache[eventEmitter].on('clear', (...args) => {
				memory.push(args);
			});

			cache.set('foo', 1);
			cache.set('bar', 2);
			cache.clear();
			expect(memory[0]).toEqual([cache, {args: [], result: new Map([['foo', 1], ['bar', 2]])}]);

			cache.set('foo', 1);
			cache.set('bar', 2);
			clear();
			expect(memory[1]).toBe(undefined);
		});

		it('clears with a predicate', () => {
			const cache = new SimpleCache();

			addEmitter(cache);

			const
				memory = [],
				clearFunction = (el, key) => key === 'bar';

			cache[eventEmitter].on('clear', (...args) => {
				memory.push(args);
			});

			cache.set('foo', 1);
			cache.set('bar', 2);
			cache.clear(clearFunction);
			expect(memory[0]).toEqual([cache, {args: [clearFunction], result: new Map([['bar', 2]])}]);
		});
	});

	describe('set', () => {
		it('sets a new value', () => {
			const
				cache = new SimpleCache(),
				{set} = addEmitter(cache);

			const memory = [];

			cache[eventEmitter].on('set', (...args) => {
				memory.push(args);
			});

			cache.set('foo', 1, {ttl: 100, cacheTTL: 200});
			expect(memory[0]).toEqual([cache, {args: ['foo', 1, {ttl: 100, cacheTTL: 200}], result: 1}]);

			set('bar', 2);
			expect(memory[1]).toEqual(undefined);
		});
	});

	describe('clone', () => {
		it('clones a cache', () => {
			const
				cache = new SimpleCache(),
				{clone} = addEmitter(cache);

			const memory = [];

			cache[eventEmitter].on('clone', (...args) => {
				memory.push(args);
			});

			cache.clone();
			expect(memory[0]).toEqual([cache, {result: new SimpleCache()}]);

			clone();
			expect(memory[1]).toEqual(undefined);
		});
	});
});
