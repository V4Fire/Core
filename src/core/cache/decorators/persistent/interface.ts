/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Cache from 'core/cache/interface';

export type PersistentCache<V = unknown, K = string, T extends Cache<V, K> = Cache<V, K>> = {
	[key in Exclude<(keyof Cache<V, K>), 'set'>]: ReturnPromise<Cache<V, K>[key]>
} & {
	/**
	 * Saves a value to the cache by the specified key
	 *
	 * @param key
	 * @param value
	 * @param opts
	 */
	set(key: K, value: V, opts?: PersistentTTLDecoratorOptions & Parameters<T['set']>[2]): Promise<V>;
};

export interface PersistentTTLDecoratorOptions {
	/**
	 * Time to expire a cache item in persistent storage
	 */
	persistentTTL?: number;
}

export interface PersistentOptions {
    persistentTTL?: number;
    loadFromStorage: 'onInit' | 'onDemand' | 'onOfflineDemand';
}

