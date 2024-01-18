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

import symbolGenerator from 'core/symbol';
import type Cache from 'core/cache/interface';

import { eventEmitter } from 'core/cache/decorators/helpers/add-emitter/const';

import type {

	AddEmitter,
	CacheWithEmitter,
	MutationEvent,
	AddEmitterReturn

} from 'core/cache/decorators/helpers/add-emitter/interface';

export * from 'core/cache/decorators/helpers/add-emitter/const';
export * from 'core/cache/decorators/helpers/add-emitter/interface';

export const
	$$ = symbolGenerator();

/**
 * Adds an event emitter to the provided cache object and wraps all mutation events to emit events, i.e.,
 * it mutates the original object. The function returns an object with the original unwrapped methods and
 * a method to subscribe to these events.
 *
 * @param cache
 */
const addEmitter: AddEmitter = <T extends Cache<K, V>, K = unknown, V = unknown>(cache: T) => {
	const
		expandedCache = <Overwrite<CacheWithEmitter<K, V, T>, {[eventEmitter]?: EventEmitter}>><unknown>cache;

	const
		cacheWithEmitter = <CacheWithEmitter<K, V, T>>expandedCache;

	let
		emitter;

	if (expandedCache[eventEmitter] == null) {
		emitter = new EventEmitter({maxListeners: 100, newListener: false});
		expandedCache[eventEmitter] = emitter;

	} else {
		emitter = expandedCache[eventEmitter];
	}

	let
		// eslint-disable-next-line @typescript-eslint/unbound-method
		originalSet = cacheWithEmitter.set,

		// eslint-disable-next-line @typescript-eslint/unbound-method
		originalRemove = cacheWithEmitter.remove,

		// eslint-disable-next-line @typescript-eslint/unbound-method
		originalClear = cacheWithEmitter.clear,

		// eslint-disable-next-line @typescript-eslint/unbound-method
		originalClone = cacheWithEmitter.clone;

	if (originalSet[eventEmitter] == null) {
		cacheWithEmitter[$$.set] = originalSet;

		cacheWithEmitter.set = function set(...args: unknown[]): V {
			const
				result = originalSet.call(this, ...args);

			emitter.emit('set', cacheWithEmitter, {
				args,
				result
			});

			return result;
		};

		cacheWithEmitter.set[eventEmitter] = true;

	} else {
		originalSet = cacheWithEmitter[$$.set] ?? originalSet;
	}

	if (originalRemove[eventEmitter] == null) {
		cacheWithEmitter[$$.remove] = originalRemove;

		cacheWithEmitter.remove = function remove(...args: unknown[]): CanUndef<V> {
			const
				result = originalRemove.call(this, ...args);

			emitter.emit('remove', cacheWithEmitter, {
				args,
				result
			});

			return result;
		};

		cacheWithEmitter.remove[eventEmitter] = true;

	} else {
		originalRemove = cacheWithEmitter[$$.remove] ?? originalRemove;
	}

	if (originalClear[eventEmitter] == null) {
		cacheWithEmitter[$$.clear] = originalClear;

		cacheWithEmitter.clear = function clear(...args: unknown[]): Map<K, V> {
			const
				result = originalClear.call(this, ...args);

			emitter.emit('clear', cacheWithEmitter, {
				args,
				result
			});

			return result;
		};

		cacheWithEmitter.clear[eventEmitter] = true;

	} else {
		originalClear = cacheWithEmitter[$$.clear] ?? originalClear;
	}

	if (originalClone[eventEmitter] == null) {
		cacheWithEmitter[$$.clone] = originalClone;

		cacheWithEmitter.clone = function clone(): Cache<K, V> {
			const
				result = originalClone.call(this);

			emitter.emit('clone', cacheWithEmitter, {result});

			return result;
		};

		cacheWithEmitter.clone[eventEmitter] = true;

	} else {
		originalClone = cacheWithEmitter[$$.clone] ?? originalClone;
	}

	return <AddEmitterReturn<T>>{
		set: originalSet.bind(cacheWithEmitter),
		remove: originalRemove.bind(cacheWithEmitter),
		clear: originalClear.bind(cacheWithEmitter),
		clone: originalClone.bind(cacheWithEmitter),

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
