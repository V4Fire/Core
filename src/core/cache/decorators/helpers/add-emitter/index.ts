/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/cache/decorators/helpers/add-emitter/README.md]]
 * @packageDocumentation
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';

import type Cache from 'core/cache/interface';
import type { ClearFilter } from 'core/cache/interface';

import { eventEmitter } from 'core/cache/decorators/helpers/add-emitter/const';

import type {

	AddEmitter,
	CacheWithEmitter,
	MutationEvent,
	AddEmitterReturn

} from 'core/cache/decorators/helpers/add-emitter/interface';

export * from 'core/cache/decorators/helpers/add-emitter/const';
export * from 'core/cache/decorators/helpers/add-emitter/interface';

/**
 * Adds an event emitter to the provided cache object and wraps all mutation events to emit events, i.e.,
 * it mutates the original object. The function returns an object with the original unwrapped methods and
 * a method to subscribe to these events.
 *
 * @param cache
 */
const addEmitter: AddEmitter = <T extends Cache<V, K>, V = unknown, K extends string = string>(cache) => {
	const
		expandedCache = <Overwrite<CacheWithEmitter<V, K, T>, {[eventEmitter]?: EventEmitter}>><unknown>cache;

	let
		emitter;

	if (expandedCache[eventEmitter] == null) {
		emitter = new EventEmitter();
		expandedCache[eventEmitter] = emitter;

	} else {
		emitter = expandedCache[eventEmitter];
	}

	const
		cacheWithEmitter = <CacheWithEmitter<V, K, T>>expandedCache;

	const
		originalSet = cacheWithEmitter.set.bind(cacheWithEmitter),
		originalRemove = cacheWithEmitter.remove.bind(cacheWithEmitter),
		originalClear = cacheWithEmitter.clear.bind(cacheWithEmitter);

	cacheWithEmitter.set = (key: K, value: V, opts?: Parameters<T['set']>[2]) => {
		const result = originalSet(key, value, opts);
		emitter.emit('set', cacheWithEmitter, {args: [key, value, opts], result});
		return result;
	};

	cacheWithEmitter.remove = (key: K) => {
		const result = originalRemove(key);
		emitter.emit('remove', cacheWithEmitter, {args: [key], result});
		return result;
	};

	cacheWithEmitter.clear = (filter?: ClearFilter<V, K>): Map<K, V> => {
		const result = originalClear(filter);
		emitter.emit('clear', cacheWithEmitter, {args: [filter], result});
		return result;
	};

	return <AddEmitterReturn<T>>{
		set: originalSet,
		remove: originalRemove,
		clear: originalClear,

		subscribe: ((method, obj, cb): void => {
			emitter.on(method, handler);

			function handler(cacheWithEmitter: object, e: MutationEvent) {
				// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
				if (cacheWithEmitter === obj || {}.isPrototypeOf.call(cacheWithEmitter, obj)) {
					cb(e);
				}
			}
		})
	};
};

export default addEmitter;
