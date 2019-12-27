/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { convertIfDate } from 'core/json';
import { syncLocalStorage, asyncLocalStorage, syncSessionStorage, asyncSessionStorage } from 'core/kv-storage/engines';
import { FactoryResult, Namespace, AsyncFactoryResult, AsyncNamespace, ClearFilter } from 'core/kv-storage/interface';
export * from 'core/kv-storage/interface';

export const
	local = factory(syncLocalStorage),
	asyncLocal = factory(asyncLocalStorage, true),
	session = factory(syncSessionStorage),
	asyncSession = factory(asyncSessionStorage, true);

export const
	{get, set, remove, namespace} = local;

export const
	canParse = /^[[{"]|^(?:true|false|null|undefined|\d+)$/;

/**
 * Creates a new kv-storage object with the specified engine
 *
 * @param engine
 * @param async - if true, then the storage is implemented async interface
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

	type WrapFn<T> =
		(val?: T) => any;

	function wrap(val?: undefined): CanPromise<undefined>;
	function wrap<T>(val: T): CanPromise<T>;
	function wrap<T, R extends WrapFn<T>>(
		val: CanUndef<T>,
		action: R
	): CanPromise<R extends (val: CanUndef<T>) => infer R ? R extends Promise<infer RV> ? RV : R : unknown>;

	function wrap<T, R extends WrapFn<T>>(val?: T, action?: R): CanUndef<CanPromise<T | ReturnType<R>>> {
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
				if (v === null) {
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
