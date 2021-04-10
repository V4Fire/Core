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
	it('should remove items after expiring', (done) => {
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

	it('should remove ttl if next call dont provide ttl', (done) => {
		const cache = addTTL(new SimpleCache());

		spyOn(cache, 'removeTTLFrom').and.callThrough();
		cache.set('foo', 1, {ttl: 10});
		cache.set('foo', 2);
		expect(cache.removeTTLFrom.calls.count()).toEqual(1);

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

	it('all methods should call the original instance', () => {
		const
			simpleCache = new SimpleCache(),
			cache = addTTL(simpleCache);

		[
			{
				method: 'set',
				parameters: ['foo', 1, undefined]
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

	it('should delete property from storage if it was deleted by side effect', () => {
		const cache = addTTL(new RestrictedCache(1));

		const memory = [];

		cache.eventEmitter.on('remove', (...args) => memory.push(args));
		cache.set('bar', 1, {ttl: 1000});
		cache.set('baz', 2, {ttl: 1000});

		expect(memory).toEqual([['bar']]);
	});
});
