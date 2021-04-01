/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/cache/decorators/persistent/README.md]]
 * @packageDocumentation
 */

import type Cache from 'core/cache/interface';
import type { SyncStorageNamespace, AsyncStorageNamespace } from 'core/kv-storage';
import type { PersistentOptions, PersistentCache } from 'core/cache/decorators/persistent/interface';

import { PersistentWrapper } from 'core/cache/decorators/persistent/helpers';

export * from 'core/cache/decorators/persistent/interface';

/**
 * Wraps the specified cache object to add a feature of persistent data storing
 *
 * @typeparam V - value type of the cache object
 *
 * @param cache - cache object to wrap
 * @param kvStorage - storage to backup data
 * @param [opts] - additional options
 *
 * @example
 * ```typescript
 * import { asyncLocal } from 'core/kv-storage';
 *
 * import addPersistent from 'core/cache/decorators/persistent';
 * import SimpleCache from 'core/cache/simple';
 *
 * const
 *   opts = {loadFromStorage: 'onInit'},
 *   persistentCache = await addPersistent(new SimpleCache(), asyncLocal, opts);
 *
 * await persistentCache.set('foo', 'bar', {persistentTTL: (2).seconds()});
 * await persistentCache.set('foo2', 'bar2');
 *
 * // Cause we use the same instance for the local data storing,
 * // this cache will have all values from the previous (it will be loaded from the storage during initialization)
 *
 * const
 *   copyOfCache = await addPersistent(new SimpleCache(), asyncLocal, opts);
 * ```
 */
const addPersistent = async <V>(
	cache: Cache<V, string>,
	kvStorage: SyncStorageNamespace | AsyncStorageNamespace,
	opts?: PersistentOptions
): Promise<PersistentCache<V, string>> => {
	const persistentCache = await new PersistentWrapper<Cache<V, string>, V>(cache, kvStorage, opts).getInstance();
	return persistentCache;
};

export default addPersistent;
