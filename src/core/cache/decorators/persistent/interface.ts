/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { AsyncStorageNamespace, SyncStorageNamespace } from 'core/kv-storage';
import type { CacheWithEmitter } from 'core/cache/decorators/helpers/add-emitter/interface';
import type { eventEmitter } from 'core/cache/decorators/helpers/add-emitter';

export type PersistentCache<K = string, V = unknown, T extends CacheWithEmitter<K, V> = CacheWithEmitter<K, V>> = {
	[key in Exclude<(keyof CacheWithEmitter<K, V>), 'set' | 'size' | typeof eventEmitter>]: ReturnPromise<CacheWithEmitter<K, V>[key]>
} & {
	/** @see [[Cache.size]] */
	size: [T['size']];

	/**
	 * Saves a value to the cache by the specified key
	 *
	 * @param key
	 * @param value
	 * @param [opts] - additional options
	 */
	set(key: K, value: V, opts?: PersistentTTLDecoratorOptions & Parameters<T['set']>[2]): Promise<V>;

	/**
	 * Removes the `persistentTTL` descriptor from a cache item by the specified key.
	 * The method returns `true` if the operation has been successful, otherwise `false`
	 * (the requested item hasn't been found).
	 *
	 * @param key
	 */
	removePersistentTTLFrom(key: K): Promise<boolean>;

	/** @see [[CacheWithEmitter[eventEmitterSymbol]]] */
	eventEmitter: T[typeof eventEmitter];

	cloneTo(storage: SyncStorageNamespace | AsyncStorageNamespace): Promise<PersistentCache<K, V>>;
};

export interface PersistentTTLDecoratorOptions {
	/**
	 * Time to expire a cache item in the persistent storage
	 */
	persistentTTL?: number;
}

export interface PersistentOptions {
	/**
	 * Default time to expire a cache item in the persistent storage
	 */
	persistentTTL?: number;

	/**
	 * How to load cache items from the persistent storage:
	 *
	 * 1. `'onInit'` - the whole stored data will be loaded during the cache initialization;
	 * 2. `'onDemand'` - each stored item will be loaded from the cache only on the first touch, i.e. on-demand or lazily;
	 * 3. `'onOfflineDemand'` - each stored item will be loaded from the cache only on the first touch and only if
	 *  there is no internet connection (the strategy is useful to create net-first offline storages)
	 *
	 * @default `'onDemand'`
	 */
	loadFromStorage?: 'onInit' | 'onDemand' | 'onOfflineDemand';
}

