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

import type { AsyncStorageNamespace, SyncStorageNamespace } from 'core/kv-storage';
import type Cache from 'core/cache/interface';

import PersistentWrapper from 'core/cache/decorators/persistent/wrapper';
import type { PersistentCache, PersistentOptions } from 'core/cache/decorators/persistent/interface';

export * from 'core/cache/decorators/persistent/interface';

/**
 * Wraps the specified cache object to add a feature of persistent data storing
 *
 * @typeParam V - value type of the cache object
 *
 * @param cache - cache object to wrap
 * @param storage - storage to save data
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
 * // Because we use the same instance for the local data storing,
 * // this cache will have all values from the previous (it will be loaded from the storage during initialization)
 *
 * const
 *   copyOfCache = await addPersistent(new SimpleCache(), asyncLocal, opts);
 * ```
 */
const addPersistent = <V>(
	cache: Cache<V, string>,
	storage: SyncStorageNamespace | AsyncStorageNamespace,
	opts?: PersistentOptions
): Promise<PersistentCache<V>> => new PersistentWrapper<Cache<V, string>, V>(cache, storage, opts).getInstance();

export default addPersistent;
