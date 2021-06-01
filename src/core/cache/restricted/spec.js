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
		expect(cache.has('foo')).toBeFalse();
		expect(cache.set('foo', 1)).toBe(1);
		expect(cache.get('foo')).toBe(1);
		expect(cache.has('foo')).toBeTrue();
		expect(cache.remove('foo')).toBe(1);
		expect(cache.has('foo')).toBeFalse();
	});

	it('restrictions', () => {
		const
			cache = new RestrictedCache(3);

		cache.set('foo', 1);
		cache.set('bar', 2);
		cache.set('bla', 3);

		expect(cache.has('foo')).toBeTrue();
		expect(cache.has('bar')).toBeTrue();
		expect(cache.has('bla')).toBeTrue();

		cache.set('baz', 4);

		expect(cache.has('foo')).toBeFalse();
		expect(cache.has('baz')).toBeTrue();
	});

	it('clear', () => {
		const cache = new RestrictedCache();

		cache.set('foo', 1);
		cache.set('bar', 2);

		expect(cache.has('foo')).toBeTrue();
		expect(cache.has('bar')).toBeTrue();

		expect(cache.clear()).toEqual(new Map([['foo', 1], ['bar', 2]]));
	});

	it('clear with a filter', () => {
		const cache = new RestrictedCache();

		cache.set('foo', 1);
		cache.set('bar', 2);

		expect(cache.has('foo')).toBeTrue();
		expect(cache.has('bar')).toBeTrue();

		expect(cache.clear((el) => el > 1)).toEqual(new Map([['bar', 2]]));
	});

	it('modify size of cache', () => {
		const cache = new RestrictedCache(1);

		cache.set('foo', 1);

		cache.modifySize(1);
		cache.set('bar', 2);

		expect(cache.has('foo')).toBeTrue();
		expect(cache.has('bar')).toBeTrue();

		expect(cache.modifySize(-2)).toEqual(new Map([['foo', 1], ['bar', 2]]));

		expect(cache.has('foo')).toBeFalse();
		expect(cache.has('bar')).toBeFalse();
	});

	it('modify size of cache with excess', () => {
		const cache = new RestrictedCache(1);

		cache.set('foo', 1);

		cache.modifySize(-1000);

		expect(cache.has('foo')).toBeFalse();
	});
});
