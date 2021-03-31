/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import addPersistent from 'core/cache/decorators/persistent';
import SimpleCache from 'core/cache/simple';
import { asyncLocal } from 'core/kv-storage';
import * as netModule from 'core/net';

describe('core/cache/decorators/persistent', () => {
	beforeEach(async () => {
		await asyncLocal.clear();
	});

	describe('core', () => {
		it('every replaced method should call original method', async () => {
			const methods = [
				{
					name: 'has',
					params: ['foo']
				}, {
					name: 'get',
					params: ['foo']
				}, {
					name: 'set',
					params: [
						'foo',
						1,
						{
							ttl: 1000,
							persistentTTL: 900
						}
					]
				}, {
					name: 'remove',
					params: ['foo']
				}, {
					name: 'keys',
					params: []
				}, {
					name: 'clear',
					params: [() => true]
				}
			];

			const options = {
				loadFromStorage: 'onInit'
			};

			const
				cache = new SimpleCache(),
				persistentCache = await addPersistent(cache, asyncLocal, options);

			for (let i = 0; i < methods.length; i += 1) {
				const method = methods[i];
				spyOn(cache, method.name).and.callThrough();
				await persistentCache[method.name](...method.params);
				expect(cache[method.name].calls.mostRecent().args).toEqual(method.params);
			}
		});
	});

	describe('engine active', () => {
		it('should init cache on create', async (done) => {
			const options = {
				loadFromStorage: 'onInit'
			};

			const
				persistentCache = await addPersistent(new SimpleCache(), asyncLocal, options);

			await persistentCache.set('foo', 'bar');
			await persistentCache.set('foo2', 'bar2');

			const
				newCache = new SimpleCache();

			setTimeout(async () => {
				await addPersistent(newCache, asyncLocal, options);

				expect(newCache.get('foo')).toEqual('bar');
				expect(newCache.get('foo2')).toEqual('bar2');
				done();
			}, 0);
		});
	});

	describe('engine lazy', () => {
		it('must save at first demand', async (done) => {
			const options = {
				loadFromStorage: 'onDemand'
			};

			const
				persistentCache = await addPersistent(new SimpleCache(), asyncLocal, options);

			await persistentCache.set('foo', 'bar');

			const
				newCache = new SimpleCache();

			setTimeout(async () => {
				const
					copyOfCache = await addPersistent(newCache, asyncLocal, options);

				expect(newCache.get('foo')).toEqual(undefined);

				expect(await copyOfCache.get('foo')).toEqual('bar');

				expect(newCache.get('foo')).toEqual('bar');
				done();
			}, 0);
		});
	});

	describe('engine lazyOffline', () => {
		it('must save at first demand if internet is offline', async (done) => {
			const options = {
				loadFromStorage: 'onOfflineDemand'
			};

			const
				persistentCache = await addPersistent(new SimpleCache(), asyncLocal, options);

			await persistentCache.set('foo', 'bar');
			await persistentCache.set('foo2', 'bar2');

			const
				newCache = new SimpleCache();

			setTimeout(async () => {
				const
					copyOfCache = await addPersistent(newCache, asyncLocal, options);

				spyOn(netModule, 'isOnline').and.returnValues(Promise.resolve({status: false}), Promise.resolve({status: true}));

				expect(newCache.get('foo')).toEqual(undefined);
				expect(await copyOfCache.get('foo')).toEqual('bar');
				expect(newCache.get('foo')).toEqual('bar');

				expect(newCache.get('foo2')).toEqual(undefined);
				expect(await copyOfCache.get('foo2')).toEqual(undefined);
				expect(newCache.get('foo2')).toEqual(undefined);
				done();
			}, 0);
		});
	});
});
