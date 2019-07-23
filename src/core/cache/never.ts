/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Cache, { ClearFilter } from 'core/cache/interface';
export * from 'core/cache/interface';

export default class NeverCache<V = unknown, K = string> implements Cache<V, K> {
	/**
	 * Cache object
	 */
	protected readonly storage: Map<K, V> = new Map();

	/** @see Cache.has */
	has(key: K): boolean {
		return false;
	}

	/** @see Cache.get */
	get(key: K): undefined {
		return undefined;
	}

	/** @see Cache.set */
	set(key: K, value: V): V {
		return value;
	}

	/** @see Cache.remove */
	remove(key: K): CanUndef<V> {
		return undefined;
	}

	/** @see Cache.keys */
	keys(): Iterator<K> {
		return this.storage.keys();
	}

	/** @see Cache.clear */
	clear(filter?: ClearFilter<V, K>): Set<K> {
		return new Set();
	}
}
