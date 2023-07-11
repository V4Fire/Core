/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/kv-storage/README.md]]
 * @packageDocumentation
 */

import { convertIfDate } from 'core/json';

import {

	syncLocalStorage,
	asyncLocalStorage,
	syncSessionStorage,
	asyncSessionStorage

} from 'core/kv-storage/engines';

import type {

	SyncStorage,
	SyncStorageNamespace,
	AsyncStorage,
	AsyncStorageNamespace,
	ClearFilter,
	StorageEngine

} from 'core/kv-storage/interface';

export * from 'core/kv-storage/interface';

/**
 * API for synchronous local storage
 *
 * @example
 * ```js
 * local.set('foo', 'bar');
 * local.get('foo'); // 'foo'
 * ```
 */
export const local = factory(syncLocalStorage);

/**
 * API for asynchronous local storage
 *
 * @example
 * ```js
 * asyncLocal.set('foo', 'bar').then(async () => {
 *   console.log(await asyncLocal.get('foo')); // 'foo'
 * });
 * ```
 */
export const asyncLocal = factory(asyncLocalStorage, true);

/**
 * API for synchronous session storage
 *
 * @example
 * ```js
 * session.set('foo', 'bar');
 * session.get('foo'); // 'foo'
 * ```
 */
export const session = factory(syncSessionStorage);

/**
 * API for asynchronous session storage
 *
 * @example
 * ```js
 * asyncSession.set('foo', 'bar').then(async () => {
 *   console.log(await asyncSession.get('foo')); // 'foo'
 * });
 * ```
 */
export const asyncSession = factory(asyncSessionStorage, true);

/**
 * Alias for a has method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 */
export const has = local.has.bind(local);

/**
 * Alias for a get method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 */
export const get = local.get.bind(local);

/**
 * Alias for a set method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 */
export const set = local.set.bind(local);

/**
 * Alias for a remove method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 */
export const remove = local.remove.bind(local);

/**
 * Alias for a clear method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 */
export const clear = local.clear.bind(local);

/**
 * Alias for a namespace method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 *
 * @example
 * ```js
 * const storage = namespace('REQUEST_STORAGE');
 * storage.set('foo', 'bar');
 * storage.get('foo'); // 'foo'
 * local.get('foo'); // undefined
 * ```
 */
export const namespace = local.namespace.bind(local);

/**
 * Creates a new kv-storage API with the specified engine
 *
 * @param engine
 * @param async - if true, then the storage is implemented an asynchronous interface
 *
 * @example
 * ```js
 * const storage = factory(window.localStorage);
 * storage.set('foo', 'bar');
 * storage.get('foo'); // 'foo'
 * ```
 */
export function factory(engine: StorageEngine, async: true): AsyncStorage;
export function factory(engine: StorageEngine, async?: false): SyncStorage;
export function factory(engine: StorageEngine, async?: boolean): AsyncStorage | SyncStorage {
	let
		has,
		get,
		set,
		remove,
		clear,
		keys;

	try {
		// eslint-disable-next-line @typescript-eslint/unbound-method
		get = engine.getItem ?? engine.get;

		if (Object.isFunction(get)) {
			get = get.bind(engine);

		} else {
			throw new ReferenceError('A method to get a value from the storage is not defined');
		}

		// eslint-disable-next-line @typescript-eslint/unbound-method
		set = engine.setItem ?? engine.set;

		if (Object.isFunction(set)) {
			set = set.bind(engine);

		} else {
			throw new ReferenceError('A method to set a value to the storage is not defined');
		}

		// eslint-disable-next-line @typescript-eslint/unbound-method
		remove = engine.removeItem ?? engine.remove ?? engine.delete;

		if (Object.isFunction(remove)) {
			remove = remove.bind(engine);

		} else {
			throw new ReferenceError('A method to remove a value from the storage is not defined');
		}

		{
			// eslint-disable-next-line @typescript-eslint/unbound-method
			const _ = engine.exists ?? engine.exist ?? engine.includes ?? engine.has;
			has = Object.isFunction(_) ? _.bind(engine) : undefined;
		}

		{
			// eslint-disable-next-line @typescript-eslint/unbound-method
			const _ = engine.clear ?? engine.clearAll ?? engine.truncate;
			clear = Object.isFunction(_) ? _.bind(engine) : undefined;
		}

		{
			// eslint-disable-next-line @typescript-eslint/unbound-method
			const _ = engine.keys;
			keys = Object.isFunction(_) ? _.bind(engine) : () => Object.keys(engine);
		}

	} catch {
		throw new TypeError('Invalid storage driver');
	}

	type WrappedFn<T> =
		(val?: T) => any;

	function wrap(val?: undefined): CanPromise<undefined>;
	function wrap<T>(val: T): CanPromise<T>;
	function wrap<T, R extends WrappedFn<T>>(
		val: CanUndef<T>,
		action: R
	): CanPromise<R extends (val: CanUndef<T>) => infer R ? R extends Promise<infer RV> ? RV : R : unknown>;

	function wrap<T, R extends WrappedFn<T>>(val?: T, action?: R): CanUndef<CanPromise<T | ReturnType<R>>> {
		if (async) {
			return (async () => {
				// eslint-disable-next-line require-atomic-updates
				val = await val;

				if (action) {
					return action(val);
				}

				return val;
			})();
		}

		if (action) {
			return action(val);
		}

		return val;
	}

	const obj = {
		has(key: string, ...args: unknown[]): CanPromise<boolean> {
			if (has != null) {
				return wrap(has(key, ...args));
			}

			return wrap(get(key, ...args), (v) => v != null);
		},

		get<T>(key: string, ...args: unknown[]): CanPromise<T> {
			return wrap(get(key, ...args), (v) => {
				if (v == null || v === 'undefined') {
					return;
				}

				return Object.parse(v, convertIfDate);
			});
		},

		set(key: string, value: unknown, ...args: unknown[]): CanPromise<void> {
			return wrap(set(key, Object.trySerialize(value), ...args), () => undefined);
		},

		remove(key: string, ...args: unknown[]): CanPromise<void> {
			return wrap(remove(key, ...args), () => undefined);
		},

		clear<T>(filter?: ClearFilter<T>, ...args: unknown[]): CanPromise<void> {
			if (filter || clear == null) {
				if (async) {
					return (async () => {
						for (const key of await keys()) {
							const
								el = await obj.get<T>(key);

							if (filter == null || Object.isTruly(filter(el, key))) {
								await remove(key, ...args);
							}
						}
					})();
				}

				for (const key of keys()) {
					const
						el = <T>obj.get(key);

					if (filter == null || Object.isTruly(filter(el, key))) {
						remove(key, ...args);
					}
				}

				return;
			}

			return wrap(clear(...args), () => undefined);
		},

		namespace(name: string): AsyncStorageNamespace | SyncStorageNamespace {
			const
				k = (key) => `${name}.${key}`;

			return <ReturnType<typeof obj['namespace']>>{
				has(key: string, ...args: unknown[]): CanPromise<boolean> {
					return obj.has(k(key), ...args);
				},

				get<T>(key: string, ...args: unknown[]): CanPromise<T> {
					return obj.get(k(key), ...args);
				},

				set(key: string, value: unknown, ...args: unknown[]): CanPromise<void> {
					return obj.set(k(key), value, ...args);
				},

				remove(key: string, ...args: unknown[]): CanPromise<void> {
					return obj.remove(k(key), ...args);
				},

				clear<T>(filter?: ClearFilter<T>, ...args: unknown[]): CanPromise<void> {
					const
						prfx = `${name}.`;

					if (async) {
						return (async () => {
							for (const key of await keys()) {
								if (!String(key).startsWith(prfx)) {
									continue;
								}

								const
									el = await obj.get<T>(key);

								if (filter == null || Object.isTruly(filter(el, key))) {
									await remove(key, ...args);
								}
							}
						})();
					}

					for (const key of keys()) {
						if (!String(key).startsWith(prfx)) {
							continue;
						}

						const
							el = <T>obj.get(key);

						if (filter == null || Object.isTruly(filter(el, key))) {
							remove(key, ...args);
						}
					}
				}
			};
		}
	};

	return <AsyncStorage | SyncStorage>obj;
}
