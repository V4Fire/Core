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
import { syncLocalStorage, asyncLocalStorage, syncSessionStorage, asyncSessionStorage } from 'core/kv-storage/engines';
import { FactoryResult, Namespace, AsyncFactoryResult, AsyncNamespace, ClearFilter } from 'core/kv-storage/interface';
export * from 'core/kv-storage/interface';

/**
 * API for synchronous local storage
 * @example
 * ```js
 * local.set('foo', 'bar');
 * local.get('foo'); // 'foo'
 * ```
 */
export const local = factory(syncLocalStorage);

/**
 * API for asynchronous local storage
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
 * @example
 * ```js
 * session.set('foo', 'bar');
 * session.get('foo'); // 'foo'
 * ```
 */
export const session = factory(syncSessionStorage);

/**
 * API for asynchronous session storage
 * @example
 * ```js
 * asyncSession.set('foo', 'bar').then(async () => {
 *   console.log(await asyncSession.get('foo')); // 'foo'
 * });
 * ```
 */
export const asyncSession = factory(asyncSessionStorage, true);

/**
 * Alias for a get method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 */
export const get = local.get;

/**
 * Alias for a set method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 */
export const set = local.set;

/**
 * Alias for a remove method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 */
export const remove = local.remove;

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
export const namespace = local.namespace;

export const
	canParse = /^[[{"]|^(?:true|false|null|\d+)$/;

/**
 * Creates a new kv-storage API with the specified engine
 *
 * @param engine
 * @param async - if true, then the storage is implemented async interface
 *
 * @example
 * ```js
 * const storage = factory(window.localStorage);
 * storage.set('foo', 'bar');
 * storage.get('foo'); // 'foo'
 * ```
 */
export function factory(engine: Dictionary, async: true): AsyncFactoryResult;
export function factory(engine: Dictionary, async?: false): FactoryResult;
export function factory(engine: Dictionary, async?: boolean): AsyncFactoryResult | FactoryResult {
	let
		has,
		get,
		set,
		remove,
		clear,
		keys;

	try {
		get = engine.getItem || engine.get;

		if (Object.isFunction(get)) {
			get = get.bind(engine);

		} else {
			throw new ReferenceError('The method for getting values from a storage is not defined');
		}

		set = engine.setItem || engine.set;

		if (Object.isFunction(set)) {
			set = set.bind(engine);

		} else {
			throw new ReferenceError('The method for setting values to a storage is not defined');
		}

		remove = engine.removeItem || engine.remove || engine.delete;

		if (Object.isFunction(remove)) {
			remove = remove.bind(engine);

		} else {
			throw new ReferenceError('The method for removing values from a storage is not defined');
		}

		const _has = engine.exists || engine.exist || engine.includes || engine.has;
		has = Object.isFunction(_has) ? _has.bind(engine) : undefined;

		const _clear = engine.clear || engine.clearAll || engine.truncate;
		clear = Object.isFunction(_clear) ? _clear.bind(engine) : undefined;

		const _keys = engine.keys;
		keys = Object.isFunction(_keys) ? _keys.bind(engine) : () => Object.keys(engine);

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
			if (has) {
				return wrap(has(key, ...args));
			}

			return wrap(get(key, ...args), (v) => v !== null);
		},

		get<T>(key: string, ...args: unknown[]): CanPromise<T> {
			return wrap(get(key, ...args), (v) => {
				if (v == null || v === 'undefined') {
					return undefined;
				}

				if (Object.isString(v) && canParse.test(v)) {
					return JSON.parse(v, convertIfDate);
				}

				return v;
			});
		},

		set(key: string, value: unknown, ...args: unknown[]): CanPromise<void> {
			return wrap(set(key, JSON.stringify(value), ...args), () => undefined);
		},

		remove(key: string, ...args: unknown[]): CanPromise<void> {
			return wrap(remove(key, ...args), () => undefined);
		},

		clear<T>(filter?: ClearFilter<T>, ...args: unknown[]): CanPromise<void> {
			if (filter || !clear) {
				return wrap(keys(), async (keys) => {
					for (const key of keys) {
						const
							el = await obj.get<T>(key);

						if (!filter || filter(el, key)) {
							await remove(key, ...args);
						}
					}
				});
			}

			return wrap(clear(...args), () => undefined);
		},

		namespace(name: string): AsyncNamespace | Namespace {
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
					return wrap(keys(), async (keys) => {
						for (const key of keys) {
							if (key.split('.')[0] !== name) {
								return;
							}

							const
								el = await obj.get<T>(key);

							if (!filter || filter(el, key)) {
								await remove(key, ...args);
							}
						}
					});
				}
			};
		}
	};

	return <AsyncFactoryResult | FactoryResult>obj;
}
