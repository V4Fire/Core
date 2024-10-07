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
	'clear' |
	'clone';

export interface MutationEvent<M extends AnyFunction = AnyFunction> {
	args: Parameters<M>;
	result: ReturnType<M>;
}

export interface MutationHandler<M extends AnyFunction = AnyFunction> {
	(e: MutationEvent<M>): void;
}

export interface CacheWithEmitter<
	K = unknown,
	V = unknown,
	T extends Cache<K, V> = Cache<K, V>
	> extends Cache<K, V> {
	/** @override */
	set(key: K, value: V, opts?: Parameters<T['set']>[2]): V;

	/**
	 * Event emitter to produce mutation events
	 */
	[eventEmitter]: EventEmitter;
}

export type AddEmitter =
	<T extends Cache<K, V>, K = unknown, V = unknown>(cache: T) => AddEmitterReturn<T>;

export interface AddEmitterReturn<T extends Cache<K, V>, K = unknown, V = unknown> {
	/** @see [[Cache.set]] */
	set: T['set'];

	/** @see [[Cache.remove]] */
	remove: T['remove'];

	/** @see [[Cache.clear]] */
	clear: T['clear'];

	/** @see [[Cache.clone]] */
	clone: T['clone'];

	/**
	 * Subscribes for mutations of the specified cache object
	 *
	 * @param method - mutation method to subscribe
	 * @param obj - object whose mutations we are handling
	 * @param cb - callback that invokes when occurring mutations
	 */
	subscribe<M extends MethodsToWrap>(method: M, obj: object, cb: MutationHandler<T[M]>): void;
}
