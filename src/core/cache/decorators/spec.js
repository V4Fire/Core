/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { asyncLocal } from 'core/kv-storage';

import addPersistent from 'core/cache/decorators/persistent';
import addTTL from 'core/cache/decorators/ttl';

import RestrictedCache from 'core/cache/restricted';

import { INDEX_STORAGE_NAME } from 'core/cache/decorators/persistent/engines/const';

describe('core/cache/decorators', () => {
	it('complex test', async () => {
		jest.spyOn(Date, 'now').mockReturnValue(0);

		const opts = {
			loadFromStorage: 'onInit'
		};

		const
			cache = new RestrictedCache(2),
			cacheWithTTL = addTTL(cache),
			persistentCache = await addPersistent(cacheWithTTL, asyncLocal, opts);

		await persistentCache.set('foo', 1);
		await persistentCache.set('bar', 1, {ttl: 10});

		expect(await asyncLocal.get(INDEX_STORAGE_NAME)).toEqual({
			foo: Number.MAX_SAFE_INTEGER,
			bar: Number.MAX_SAFE_INTEGER
		});

		await persistentCache.set('baz', 1);

		expect(await asyncLocal.get(INDEX_STORAGE_NAME)).toEqual({
			bar: Number.MAX_SAFE_INTEGER,
			baz: Number.MAX_SAFE_INTEGER
		});

		await new Promise((r) => setTimeout(r, 50));
		expect(await asyncLocal.get(INDEX_STORAGE_NAME)).toEqual({
			baz: Number.MAX_SAFE_INTEGER
		});
	});
});
