/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import DefaultCache from 'core/cache/default';

describe('core/cache/default', () => {
	it('default value', () => {
		const
			cache = new DefaultCache(Array);

		expect(cache.has('foo')).toBeFalse();

		expect(cache.get('foo')).toEqual([]);
		expect(cache.size).toBe(1);

		cache.defaultFactory = () => 10;

		expect(cache.get('bla')).toEqual(10);
		expect(cache.size).toBe(2);

		expect(cache.set('bar', 10)).toBe(10);
		expect(cache.size).toBe(3);
	});

	it('crud', () => {
		const
			cache = new DefaultCache();

		expect(cache.has('foo')).toBeFalse();
		expect(cache.set('foo', 1)).toBe(1);
		expect(cache.get('foo')).toBe(1);
		expect(cache.has('foo')).toBeTrue();
		expect(cache.size).toBe(1);
		expect(cache.remove('foo')).toBe(1);
		expect(cache.has('foo')).toBeFalse();
	});

	it('default iterator', () => {
		const
			cache = new DefaultCache();

		cache.set('1', 1);
		cache.set('2', 2);

		expect(cache[Symbol.iterator]().next()).toEqual({value: '1', done: false});
		expect([...cache]).toEqual(['1', '2']);
	});

	it('`keys`', () => {
		const
			cache = new DefaultCache();

		cache.set('1', 1);
		cache.set('2', 2);

		expect([...cache.keys()]).toEqual(['1', '2']);
	});

	it('`values`', () => {
		const
			cache = new DefaultCache();

		cache.set('1', 1);
		cache.set('2', 2);

		expect([...cache.values()]).toEqual([1, 2]);
	});

	it('`entries`', () => {
		const
			cache = new DefaultCache();

		cache.set('1', 1);
		cache.set('2', 2);

		expect([...cache.entries()]).toEqual([['1', 1], ['2', 2]]);
	});

	it('`clear`', () => {
		const
			cache = new DefaultCache();

		cache.set('foo', 1);
		cache.set('bar', 2);

		expect(cache.has('foo')).toBeTrue();
		expect(cache.has('bar')).toBeTrue();

		expect(cache.clear()).toEqual(new Map([['foo', 1], ['bar', 2]]));
	});

	it('`clear` with a filter', () => {
		const
			cache = new DefaultCache();

		cache.set('foo', 1);
		cache.set('bar', 2);

		expect(cache.has('foo')).toBeTrue();
		expect(cache.has('bar')).toBeTrue();

		expect(cache.clear((el) => el > 1)).toEqual(new Map([['bar', 2]]));
	});

	it('`clones`', () => {
		const
			cache = new DefaultCache(() => 10),
			obj = {a: 1};

		cache.set('foo', 1);
		cache.set('bar', obj);

		expect(cache.has('foo')).toBeTrue();
		expect(cache.has('bar')).toBeTrue();

		const newCache = cache.clone();

		expect(cache !== newCache).toBeTrue();
		expect(newCache.has('foo')).toBeTrue();
		expect(newCache.has('bar')).toBeTrue();
		expect(cache.storage !== newCache.storage).toBeTrue();
		expect(cache.get('bla') === newCache.get('bla')).toBeTrue();
	});
});
