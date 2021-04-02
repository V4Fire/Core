/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import * as netModule from 'core/net';
import { asyncLocal } from 'core/kv-storage';

import addPersistent from 'core/cache/decorators/persistent';
import SimpleCache from 'core/cache/simple';

import engines from 'core/cache/decorators/persistent/engines';
import { INDEX_STORAGE_NAME, TTL_POSTFIX } from 'core/cache/decorators/persistent/engines/const';

describe('core/cache/decorators/persistent', () => {
	beforeEach(async () => {
		await asyncLocal.clear();
	});

	beforeAll(() => {
		spyOn(Date, 'now').and.returnValue(0);
	});

	describe('core functionality', () => {
		it('every replaced method should call the original method', async () => {
			const methods = [
				{
					name: 'has',
					params: ['foo']
				},

				{
					name: 'get',
					params: ['foo']
				},

				{
					name: 'set',
					params: [
						'foo',

						1,

						{
							ttl: 1000,
							persistentTTL: 900
						}
					]
				},

				{
					name: 'remove',
					params: ['foo']
				},

				{
					name: 'keys',
					params: []
				},

				{
					name: 'clear',
					params: [() => true]
				}
			];

			const opts = {
				loadFromStorage: 'onInit'
			};

			const
				cache = new SimpleCache(),
				persistentCache = await addPersistent(cache, asyncLocal, opts);

			for (let i = 0; i < methods.length; i += 1) {
				const method = methods[i];
				spyOn(cache, method.name).and.callThrough();

				await persistentCache[method.name](...method.params);
				expect(cache[method.name].calls.mostRecent().args).toEqual(method.params);
			}
		});

		it('providing the default `persistentTTL` option', async () => {
			const opts = {
				loadFromStorage: 'onInit',
				persistentTTL: 100
			};

			const
				cache = new SimpleCache(),
				persistentCache = await addPersistent(cache, asyncLocal, opts);

			await persistentCache.set('foo', null);
			expect(await asyncLocal.get(INDEX_STORAGE_NAME)).toEqual({foo: 100});

			await persistentCache.set('bar', null, {persistentTTL: 150});
			expect(await asyncLocal.get(INDEX_STORAGE_NAME)).toEqual({foo: 100, bar: 150});
		});

		it('collapsing operations with the same key', async () => {
			const opts = {
				loadFromStorage: 'onInit'
			};

			const
				cache = new SimpleCache(),
				persistentCache = await addPersistent(cache, asyncLocal, opts);

			spyOn(asyncLocal, 'set').and.callThrough();
			persistentCache.set('foo', 1);
			await persistentCache.set('foo', 2);

			expect(asyncLocal.set.calls.first().args).toEqual(['foo', 2]);
		});
	});

	describe('`onInit` loading from the storage', () => {
		it('should init the cache during initialization', async () => {
			const opts = {
				loadFromStorage: 'onInit'
			};

			const
				persistentCache = await addPersistent(new SimpleCache(), asyncLocal, opts);

			await persistentCache.set('foo', 'bar');
			await persistentCache.set('foo2', 'bar2');

			const
				newCache = new SimpleCache();

			await addPersistent(newCache, asyncLocal, opts);

			expect(newCache.get('foo')).toEqual('bar');
			expect(newCache.get('foo2')).toEqual('bar2');
		});

		it('should save the `persistentTTL` descriptor', async () => {
			const opts = {
				loadFromStorage: 'onInit'
			};

			const
				persistentCache = await addPersistent(new SimpleCache(), asyncLocal, opts);

			await persistentCache.set('foo', 'bar');
			await persistentCache.set('foo2', 'bar2', {persistentTTL: 100});

			expect(await asyncLocal.get(INDEX_STORAGE_NAME)).toEqual({
				foo: Number.MAX_SAFE_INTEGER,
				foo2: 100
			});
		});

		it('should not save an item if it is already expired', async () => {
			const opts = {
				loadFromStorage: 'onInit'
			};

			const
				persistentCache = await addPersistent(new SimpleCache(), asyncLocal, opts);

			await persistentCache.set('foo', 'bar', {persistentTTL: -100});

			const
				newCache = new SimpleCache();

			expect(await asyncLocal.get(INDEX_STORAGE_NAME)).toEqual({
				foo: -100
			});

			await addPersistent(newCache, asyncLocal, opts);

			expect(newCache.get('foo')).toEqual(undefined);
			expect(await asyncLocal.get('foo')).toEqual(undefined);
			expect(await asyncLocal.get(INDEX_STORAGE_NAME)).toEqual({});
		});

		it('removing the `persistentTTL` descriptor from a cache item', async () => {
			const opts = {
				loadFromStorage: 'onInit'
			};

			const
				persistentCache = await addPersistent(new SimpleCache(), asyncLocal, opts);

			await persistentCache.set('foo', 'bar', {persistentTTL: 100});

			expect(await asyncLocal.get(INDEX_STORAGE_NAME)).toEqual({foo: 100});

			await persistentCache.removePersistentTTLFrom('foo');

			expect(await asyncLocal.get(INDEX_STORAGE_NAME)).toEqual({});
		});
	});

	describe('`onDemand` loading from the storage', () => {
		it('should work by default', async () => {
			spyOn(engines, 'onDemand').and.callThrough();

			await addPersistent(new SimpleCache(), asyncLocal);

			expect(engines.onDemand.calls.count()).toBe(1);
		});

		it('must save an item at the first demand', async () => {
			const opts = {
				loadFromStorage: 'onDemand'
			};

			const
				persistentCache = await addPersistent(new SimpleCache(), asyncLocal, opts);

			await persistentCache.set('foo', 'bar');

			const
				newCache = new SimpleCache(),
				copyOfCache = await addPersistent(newCache, asyncLocal, opts);

			expect(newCache.get('foo')).toEqual(undefined);

			expect(await copyOfCache.get('foo')).toEqual('bar');

			expect(newCache.get('foo')).toEqual('bar');
		});

		it('should save the `persistentTTL` descriptor', async () => {
			const opts = {
				loadFromStorage: 'onDemand'
			};

			const
				persistentCache = await addPersistent(new SimpleCache(), asyncLocal, opts);

			await persistentCache.set('foo', 'bar');
			await persistentCache.set('foo2', 'bar2', {persistentTTL: 100});

			expect(await asyncLocal.get(`foo${TTL_POSTFIX}`)).toEqual(undefined);
			expect(await asyncLocal.get(`foo2${TTL_POSTFIX}`)).toEqual(100);
		});

		it('should not save an item if it is already expired', async () => {
			const opts = {
				loadFromStorage: 'onDemand'
			};

			const
				persistentCache = await addPersistent(new SimpleCache(), asyncLocal, opts);

			await persistentCache.set('foo', 'bar', {persistentTTL: -100});

			const
				newCache = new SimpleCache(),
				copyOfCache = await addPersistent(newCache, asyncLocal, opts);

			expect(await copyOfCache.get('foo')).toEqual(undefined);

			expect(newCache.get('foo')).toEqual(undefined);

			expect(await asyncLocal.get('foo')).toEqual(undefined);
			expect(await asyncLocal.get(`foo${TTL_POSTFIX}`)).toEqual(undefined);
		});

		it('removing the `persistentTTL` descriptor from a cache item', async () => {
			const opts = {
				loadFromStorage: 'onDemand'
			};

			const
				persistentCache = await addPersistent(new SimpleCache(), asyncLocal, opts);

			await persistentCache.set('foo', 'bar', {persistentTTL: 100});

			expect(await asyncLocal.get(`foo${TTL_POSTFIX}`)).toEqual(100);

			await persistentCache.removePersistentTTLFrom('foo');

			expect(await asyncLocal.get(`foo${TTL_POSTFIX}`)).toEqual(undefined);
		});
	});

	describe('`onOfflineDemand` loading from the storage', () => {
		it('must load a value from the storage cache only if there is no internet', async () => {
			const opts = {
				loadFromStorage: 'onOfflineDemand'
			};

			const
				persistentCache = await addPersistent(new SimpleCache(), asyncLocal, opts);

			await persistentCache.set('foo', 'bar');
			await persistentCache.set('foo2', 'bar2');

			const
				newCache = new SimpleCache(),
				copyOfCache = await addPersistent(newCache, asyncLocal, opts);

			spyOn(netModule, 'isOnline').and.returnValues(
				Promise.resolve({status: false}),
				Promise.resolve({status: true}),
				Promise.resolve({status: false})
			);

			expect(newCache.get('foo')).toEqual(undefined);
			expect(await copyOfCache.get('foo')).toEqual('bar');
			expect(newCache.get('foo')).toEqual('bar');

			expect(newCache.get('foo2')).toEqual(undefined);
			expect(await copyOfCache.get('foo2')).toEqual(undefined);
			expect(newCache.get('foo2')).toEqual(undefined);

			expect(newCache.get('foo2')).toEqual(undefined);
			expect(await copyOfCache.get('foo2')).toEqual('bar2');
			expect(newCache.get('foo2')).toEqual('bar2');
		});
	});
});
