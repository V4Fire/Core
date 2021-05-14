/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/cache/decorators/helpers/emit/README.md]]
 * @packageDocumentation
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';

import type Cache from 'core/cache/interface';
import type { EmitCache, AddEmit } from 'core/cache/decorators/helpers/emit/interface';
import type { ClearFilter } from 'core/cache';

export const eventEmitterSymbol = Symbol('Event emitter');

const addEmit: AddEmit = <T extends Cache<V, K>, V = unknown, K = string>(cache) => {
	const emitCacheWithoutEmitter = <Overwrite<EmitCache<V, K, T>, {[eventEmitterSymbol]?: EventEmitter}>><unknown>cache;

	if (!emitCacheWithoutEmitter[eventEmitterSymbol]) {
		emitCacheWithoutEmitter[eventEmitterSymbol] = new EventEmitter();
	}

	const
		emitCache = <EmitCache<V, K, T>>emitCacheWithoutEmitter,
		originalRemove = emitCache.remove.bind(emitCache),
		originalSet = emitCache.set.bind(emitCache),
		originalClear = emitCache.clear.bind(emitCache);

	emitCache.set = (key: K, value: V, opts?: Parameters<T['set']>[2]) => {
		const result = originalSet(key, value, opts);
		emitCache[eventEmitterSymbol].emit('set', emitCache, {args: [key, value, opts], result});
		return result;
	};

	emitCache.remove = (key: K) => {
		const result = originalRemove(key);
		emitCache[eventEmitterSymbol].emit('remove', emitCache, {args: [key], result});
		return result;
	};

	emitCache.clear = (filter?: ClearFilter<V, K>): Map<K, V> => {
		const result = originalClear(filter);
		emitCache[eventEmitterSymbol].emit('clear', emitCache, {args: [filter], result});
		return result;
	};

	return {
		remove: originalRemove,
		set: originalSet,
		clear: originalClear,
		subscribe: <M extends 'remove' | 'clear' | 'set'>(eventName, thisInstance, callback): void => {
			emitCache[eventEmitterSymbol].on(
				eventName,
				(emitCache: Object, signature: { args: Parameters<T[M]>; result: ReturnType<T[M]> }) => {
					if (emitCache.isPrototypeOf(thisInstance)) {
						callback(signature);
					}
				}
			);
		}
	};
};

export default addEmit;
