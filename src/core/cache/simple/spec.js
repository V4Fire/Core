/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SimpleCache from 'core/cache/simple';

describe('core/cache/simple', () => {
	it('crud', () => {
		const cache = new SimpleCache();
		expect(cache.has('foo')).toBeFalse();
		expect(cache.set('foo', 1)).toBe(1);
		expect(cache.get('foo')).toBe(1);
		expect(cache.has('foo')).toBeTrue();
		expect(cache.remove('foo')).toBe(1);
		expect(cache.has('foo')).toBeFalse();
	});

	it('clear', () => {
		const cache = new SimpleCache();

		cache.set('foo', 1);
		cache.set('bar', 2);

		expect(cache.has('foo')).toBeTrue();
		expect(cache.has('bar')).toBeTrue();

		expect(cache.clear()).toEqual(new Map([['foo', 1], ['bar', 2]]));
	});

	it('clear with a filter', () => {
		const cache = new SimpleCache();

		cache.set('foo', 1);
		cache.set('bar', 2);

		expect(cache.has('foo')).toBeTrue();
		expect(cache.has('bar')).toBeTrue();

		expect(cache.clear((el) => el > 1)).toEqual(new Map([['bar', 2]]));
	});
});
