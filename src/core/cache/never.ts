/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Cache, { ClearFilter } from 'core/cache/cache';

export default class NeverCache<V = unknown, K = string> extends Cache<V, K> {
	/** @override */
	has(key: K): boolean {
		return false;
	}

	/** @override */
	get(key: K): undefined {
		return undefined;
	}

	/** @override */
	set(key: K, value: V): V {
		return value;
	}

	/** @override */
	remove(key: K): CanUndef<V> {
		return undefined;
	}

	/** @override */
	clear(filter?: ClearFilter<V, K>): Set<K> {
		return new Set();
	}
}
