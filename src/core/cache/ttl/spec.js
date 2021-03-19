/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SimpleCache from 'core/cache/simple';
import wrapCacheWithTTL from 'core/cache/ttl';

describe('core/cache/ttl', () => {
	it('should delete props after timeout', (done) => {
		const cache = wrapCacheWithTTL(new SimpleCache());

		cache.set('foo', 1);
		cache.set('bar', 2, {ttl: 5});
		cache.set('baz', 3, {ttl: 0});

		setTimeout(() => {
			expect(cache.has('foo')).toBe(true);
			expect(cache.get('foo')).toBe(1);
			expect(cache.has('bar')).toBe(false);
			expect(cache.has('baz')).toBe(false);

			done();
		}, 10);
	});

	it('should not delete props after timeout if clearTTL was called', (done) => {
		const cache = wrapCacheWithTTL(new SimpleCache());

		cache.set('foo', 1);

		cache.set('bar', 2, {ttl: 5});
		cache.clearTTL('bar');

		cache.set('baz', 3, {ttl: 0});
		cache.clearTTL('baz');

		setTimeout(() => {
			expect(cache.has('foo')).toBe(true);
			expect(cache.has('bar')).toBe(true);
			expect(cache.has('baz')).toBe(true);

			done();
		}, 10);
	});

	it('remove work', () => {
		const cache = wrapCacheWithTTL(new SimpleCache());

		cache.set('foo', 1);
		cache.set('bar', 2);

		expect(cache.clear()).toEqual(new Map([['foo', 1], ['bar', 2]]));
	});

	it('all methods should call original instance', () => {
		const
			simpleCache = new SimpleCache(),
			cache = wrapCacheWithTTL(simpleCache);

		[
			{
				method: 'set',
				parameters: ['foo', 1]
			}, {
				method: 'remove',
				parameters: ['foo']
			}, {
				method: 'clear',
				parameters: [() => true]
			}
		].forEach((el) => {
			spyOn(simpleCache, el.method).and.callThrough();
			cache[el.method](...el.parameters);

			expect(simpleCache[el.method].calls.mostRecent().args).toEqual(el.parameters);
		});
	});
});
