/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/cache/decorators/emit/README.md]]
 * @packageDocumentation
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';

import type Cache from 'core/cache/interface';
import type { EmitCache, WrapEmit } from 'core/cache/decorators/emit/interface';

const wrapEmit: WrapEmit = <T extends Cache<V, K>, V = unknown, K = string>(cache) => {
	const emitCacheWithoutEmitter = <Overwrite<EmitCache<V, K, T>, { eventEmitter?: EventEmitter }>><unknown>cache;

	if (!emitCacheWithoutEmitter.eventEmitter) {
		emitCacheWithoutEmitter.eventEmitter = new EventEmitter();
	}

	const
		emitCache = <EmitCache<V, K, T>>emitCacheWithoutEmitter,
		originalRemove = emitCache.remove.bind(emitCache);

	emitCache.remove = (key: K) => {
		emitCache.eventEmitter.emit('remove', emitCache, [key]);
		return originalRemove.call(emitCache, key);
	};

	return {
		remove: originalRemove,
		subscribe: <M extends 'remove'>(eventName, thisInstance, callback): void => {
			emitCache.eventEmitter.on(
				eventName,
				(emitCache: Object, args: unknown[]) => {
					if (emitCache.isPrototypeOf(thisInstance)) {
						callback(...<Parameters<T[M]>>args);
					}
				}
			);
		}
	};
};

export default wrapEmit;
