/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { SyncStorageNamespace, AsyncStorageNamespace } from '../../../../core/kv-storage';
import type Cache from '../../../../core/cache/interface';
import type { PersistentEngine } from '../../../../core/cache/decorators/persistent/engines/interface';
import type { PersistentOptions, PersistentCache } from '../../../../core/cache/decorators/persistent/interface';
export default class PersistentWrapper<T extends Cache<V, string>, V = unknown> {
    /**
     * Default TTL to store items
     */
    protected readonly ttl?: number;
    /**
     * Original cache object
     */
    protected readonly cache: T;
    /**
     * Wrapped cache object
     */
    protected readonly wrappedCache: PersistentCache<V>;
    /**
     * Engine to save cache items within a storage
     */
    protected readonly engine: PersistentEngine;
    /**
     * Object that stores keys of all properties that have already been fetched from the storage
     */
    protected readonly fetchedItems: Set<string>;
    /**
     * @param cache - cache object to wrap
     * @param storage - storage object to save cache items
     * @param [opts] - additional options
     */
    constructor(cache: T, storage: SyncStorageNamespace | AsyncStorageNamespace, opts?: PersistentOptions);
    /**
     * Returns an instance of the wrapped cache
     */
    getInstance(): Promise<PersistentCache<V>>;
    /**
     * Implements API of the wrapped cache object
     */
    protected implementAPI(): void;
    /**
     * Returns the default implementation for the specified cache method with adding a feature of persistent storing
     * @param method
     */
    protected getDefaultImplementation(method: 'has'): (key: string) => Promise<boolean>;
    protected getDefaultImplementation(method: 'get'): (key: string) => Promise<CanUndef<V>>;
    /**
     * Checks a cache item by the specified key in the persistent storage
     * @param key
     */
    protected checkItemInStorage(key: string): Promise<void>;
}
