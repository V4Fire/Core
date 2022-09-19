/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import addTTL from 'core/cache/decorators/ttl';

import SimpleCache from 'core/cache/simple';
import RestrictedCache from 'core/cache/restricted';

describe('core/cache/decorators/ttl', () => {
	it.only('should remove items after expiring', (done) => {
		const cache = addTTL(new SimpleCache());

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

	it('should not remove items before expiring', (done) => {
		const cache = addTTL(new SimpleCache());

		cache.set('foo', 1);
		cache.set('bar', 2, {ttl: 50});
		cache.set('baz', 3, {ttl: 50});

		setTimeout(() => {
			expect(cache.has('foo')).toBe(true);
			expect(cache.has('bar')).toBe(true);
			expect(cache.has('baz')).toBe(true);

			done();
		}, 10);
	});

	it('should override the default `ttl`', (done) => {
		const cache = addTTL(new SimpleCache(), 10);

		cache.set('foo', 1);
		cache.set('bar', 2, {ttl: 50});

		setTimeout(() => {
			expect(cache.has('foo')).toBe(false);
			expect(cache.has('bar')).toBe(true);

			done();
		}, 25);
	});

	it("should remove `ttl` if the next invoking doesn't provide `ttl`", (done) => {
		const cache = addTTL(new SimpleCache());
		jest.spyOn(cache, 'removeTTLFrom');

		cache.set('foo', 1, {ttl: 10});
		cache.set('foo', 2);

		expect(cache.removeTTLFrom).toHaveBeenCalledTimes(1);

		setTimeout(() => {
			expect(cache.get('foo')).toBe(2);
			done();
		}, 50);
	});

	it('should not remove items after expiring after invoking of `removeTTLFrom`', (done) => {
		const cache = addTTL(new SimpleCache());

		cache.set('foo', 1);

		cache.set('bar', 2, {ttl: 5});
		cache.removeTTLFrom('bar');

		cache.set('baz', 3, {ttl: 0});
		cache.removeTTLFrom('baz');

		setTimeout(() => {
			expect(cache.has('foo')).toBe(true);
			expect(cache.has('bar')).toBe(true);
			expect(cache.has('baz')).toBe(true);

			done();
		}, 10);
	});

	it('clearing of the storage', () => {
		const cache = addTTL(new SimpleCache());

		cache.set('foo', 1);
		cache.set('bar', 2);

		expect(cache.clear()).toEqual(new Map([['foo', 1], ['bar', 2]]));
	});

	it('should delete a value from the storage if a side effect has deleted it', () => {
		const
			cache = addTTL(new RestrictedCache(1)),
			memory = [];

		cache.removeTTLFrom = (key) => {
			memory.push(key);
		};

		cache.set('bar', 1, {ttl: 1000});
		cache.set('baz', 2, {ttl: 1000});

		expect(memory).toEqual(['bar']);
	});

	it('should clone the cache with `ttl`', (done) => {
		const
			cache = addTTL(new SimpleCache());

		cache.set('bar', 1, {ttl: 5});
		cache.set('baz', 1, {ttl: 10});

		const
			cloned = cache.clone();

		expect(cloned.has('bar')).toBe(true);

		cloned.set('baz', 1, {ttl: 20});

		setTimeout(() => {
			expect(cloned.has('bar')).toBe(false);
			expect(cloned.has('baz')).toBe(true);

			done();
		}, 15);
	});

	it('`clear` caused by a side effect', () => {
		const
			originalCache = new SimpleCache(),
			cache = addTTL(originalCache),
			memory = [];

		cache.removeTTLFrom = (key) => {
			memory.push(key);
		};

		cache.set('bar', 1, {ttl: 100});
		cache.set('baz', 2, {ttl: 100});

		originalCache.clear();

		expect(memory).toEqual(['bar', 'baz']);
	});

	it('`set` caused by a side effect', () => {
		const
			originalCache = new SimpleCache(),
			cache = addTTL(originalCache),
			memory = [];

		cache.removeTTLFrom = (key) => {
			memory.push(key);
		};

		cache.set('bar', 1, {ttl: 100});
		originalCache.set('bar', 2);

		expect(memory).toEqual(['bar']);
	});
});
