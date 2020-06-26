/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import NeverCache from 'core/cache/never';

describe('core/cache/never', () => {
	it('crud', () => {
		const cache = new NeverCache();
		expect(cache.has('foo')).toBeFalse();
		expect(cache.set('foo', 1)).toBe(1);
		expect(cache.get('foo')).toBeUndefined();
		expect(cache.has('foo')).toBeFalse();
		expect(cache.remove('foo')).toBeUndefined();
		expect(cache.has('foo')).toBeFalse();
	});

	it('clear', () => {
		const cache = new NeverCache();

		cache.set('foo', 1);
		cache.set('bar', 2);

		expect(cache.clear()).toEqual(new Map([]));
	});

	it('clear with a filter', () => {
		const cache = new NeverCache();

		cache.set('foo', 1);
		cache.set('bar', 2);

		expect(cache.clear((el) => el > 1)).toEqual(new Map([]));
	});
});
