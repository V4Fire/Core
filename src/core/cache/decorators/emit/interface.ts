/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { EventEmitter2 as EventEmitter } from 'eventemitter2';
import type Cache from 'core/cache/interface';

export interface EmitCache<V = unknown, K = string, T extends Cache<V, K> = Cache<V, K>> extends Cache<V, K> {
	/**
	 * Saves a value to the cache by the specified key
	 *
	 * @param key
	 * @param value
	 * @param [opts] - additional options
	 */
	set(key: K, value: V, opts?: Parameters<T['set']>[2]): V;

	/**
	 * Emit events caused by side-effect
	 */
	eventEmitter: EventEmitter;
}

export type WrapEmit = <T extends Cache<V, K>,
	V = unknown,
	K = string,
>(cache: T) => {
	remove: T['remove'];
	subscribe<M extends 'remove'>(key: M, thisInstance: Object, callback: ((...args: Parameters<T[M]>) => void)): void;
};
