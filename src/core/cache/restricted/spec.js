/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import RestrictedCache from 'core/cache/restricted';

describe('core/cache/restricted', () => {
	it('crud', () => {
		const cache = new RestrictedCache();
		expect(cache.has('foo')).toBe(false);
		expect(cache.set('foo', 1)).toBe(1);
		expect(cache.get('foo')).toBe(1);
		expect(cache.has('foo')).toBe(true);
		expect(cache.size).toBe(1);
		expect(cache.remove('foo')).toBe(1);
		expect(cache.has('foo')).toBe(false);
	});

	it('specifying capacity', () => {
		const
			cache = new RestrictedCache(3);

		cache.set('foo', 1);
		cache.set('bar', 2);
		cache.set('bla', 3);

		expect(cache.has('foo')).toBe(true);
		expect(cache.has('bar')).toBe(true);
		expect(cache.has('bla')).toBe(true);

		cache.set('baz', 4);

		expect(cache.size).toBe(3);
		expect(cache.has('foo')).toBe(false);
		expect(cache.has('baz')).toBe(true);
	});

	it('default iterator', () => {
		const
			cache = new RestrictedCache(2);

		cache.set('1', 1);
		cache.set('2', 2);
		cache.set('3', 3);

		expect(cache[Symbol.iterator]().next()).toEqual({value: '2', done: false});
		expect([...cache]).toEqual(['2', '3']);
	});

	it('`keys`', () => {
		const
			cache = new RestrictedCache(2);

		cache.set('1', 1);
		cache.set('2', 2);
		cache.set('3', 3);

		expect([...cache.keys()]).toEqual(['2', '3']);
	});

	it('`values`', () => {
		const
			cache = new RestrictedCache(2);

		cache.set('1', 1);
		cache.set('2', 2);
		cache.set('3', 3);

		expect([...cache.values()]).toEqual([2, 3]);
	});

	it('`entries`', () => {
		const
			cache = new RestrictedCache(2);

		cache.set('1', 1);
		cache.set('2', 2);
		cache.set('3', 3);

		expect([...cache.entries()]).toEqual([['2', 2], ['3', 3]]);
	});

	it('`clear`', () => {
		const cache = new RestrictedCache(2);

		cache.set('foo', 1);
		cache.set('bar', 2);

		expect(cache.has('foo')).toBe(true);
		expect(cache.has('bar')).toBe(true);

		expect(cache.clear()).toEqual(new Map([['foo', 1], ['bar', 2]]));
	});

	it('`clear` with a filter', () => {
		const cache = new RestrictedCache();

		cache.set('foo', 1);
		cache.set('bar', 2);

		expect(cache.has('foo')).toBe(true);
		expect(cache.has('bar')).toBe(true);

		expect(cache.clear((el) => el > 1)).toEqual(new Map([['bar', 2]]));
	});

	it("modifying cache' capacity", () => {
		const cache = new RestrictedCache(1);

		cache.set('foo', 1);

		cache.setCapacity(2);
		cache.set('bar', 2);

		expect(cache.has('foo')).toBe(true);
		expect(cache.has('bar')).toBe(true);

		expect(cache.setCapacity(0)).toEqual(new Map([['foo', 1], ['bar', 2]]));

		expect(cache.has('foo')).toBe(false);
		expect(cache.has('bar')).toBe(false);
	});

	it('`clones`', () => {
		const
			cache = new RestrictedCache(),
			obj = {a: 1};

		cache.set('foo', 1);
		cache.set('bar', obj);

		expect(cache.has('foo')).toBe(true);
		expect(cache.has('bar')).toBe(true);

		const newCache = cache.clone();

		expect(cache !== newCache).toBe(true);
		expect(newCache.has('foo')).toBe(true);
		expect(newCache.has('bar')).toBe(true);
		expect(cache.storage !== newCache.storage).toBe(true);
		expect(cache.queue !== newCache.queue).toBe(true);
		expect(cache.get('bar') === newCache.get('bar')).toBe(true);
	});
});
