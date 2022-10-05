/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { EventEmitter2 as EventEmitter } from 'eventemitter2';

import { eventEmitter } from 'core/cache/decorators/helpers/add-emitter/const';
import type Cache from 'core/cache/interface';

export type MethodsToWrap =
	'set' |
	'remove' |
	'clear';

export interface MutationEvent<M extends AnyFunction = AnyFunction> {
	args: Parameters<M>;
	result: ReturnType<M>;
}

export interface MutationHandler<M extends AnyFunction = AnyFunction> {
	(e: MutationEvent<M>): void;
}

export interface CacheWithEmitter<V = unknown, K = string, T extends Cache<V, K> = Cache<V, K>> extends Cache<V, K> {
	/** @override */
	set(key: K, value: V, opts?: Parameters<T['set']>[2]): V;

	/**
	 * Event emitter to produce mutation events
	 */
	[eventEmitter]: EventEmitter;
}

export type AddEmitter =
	<T extends Cache<V, K>, V = unknown, K extends string = string>(cache: T) => AddEmitterReturn<T>;

export interface AddEmitterReturn<T extends Cache<V, K>, V = unknown, K extends string = string> {
	/** @see {@link Cache.set} */
	set: T['set'];

	/** @see {@link Cache.remove} */
	remove: T['remove'];

	/** @see {@link Cache.clear} */
	clear: T['clear'];

	/**
	 * Subscribes for mutations of the specified cache object
	 *
	 * @param method - mutation method to subscribe
	 * @param obj - object whose mutations we are handling
	 * @param cb - callback that invokes when occurring mutations
	 */
	subscribe<M extends MethodsToWrap>(method: M, obj: object, cb: MutationHandler<T[M]>): void;
}
