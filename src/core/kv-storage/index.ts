/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { convertIfDate } from 'core/json';
import { syncLocalStorage, asyncLocalStorage, syncSessionStorage, asyncSessionStorage } from 'core/kv-storage/engines';

export const
	local = factory(syncLocalStorage),
	asyncLocal = factory(asyncLocalStorage, true),
	session = factory(syncSessionStorage),
	asyncSession = factory(asyncSessionStorage, true);

export const
	{get, set, remove, namespace} = local;

interface Namespace {
	exists(key: string): boolean;
	get(key: string): any;
	set(key: string, value: any): void;
	remove(key: string): void;
	clear(filter?: (el: string, key: string) => any): void;
}

interface FactoryResult extends Namespace {
	namespace(name: string): Namespace;
}

interface AsyncNamespace {
	exists(key: string): Promise<boolean>;
	get(key: string): Promise<any>;
	set(key: string, value: any, ttl?: number): Promise<void>;
	remove(key: string): Promise<void>;
	clear(filter?: (el: string, key: string) => any): Promise<void>;
}

interface AsyncFactoryResult extends AsyncNamespace {
	namespace(name: string): AsyncNamespace;
}

function factory(storage: Storage, async: true): AsyncFactoryResult;
function factory(storage: Storage, async?: false): FactoryResult;
function factory(storage: Storage, async?: boolean): FactoryResult | AsyncFactoryResult {
	function wrap(val?: any): any {
		if (async) {
			return (async () => val)();
		}

		return val;
	}

	const obj = {
		/**
		 * Returns true if the specified key exists in a storage
		 * @param key
		 */
		exists(key: string): any {
			return wrap(storage.getItem(key) !== null);
		},

		/**
		 * Returns a value from a storage by the specified key
		 * @param key
		 */
		get(key: string): any {
			const val = storage.getItem(key);
			return wrap(val === null ? undefined : JSON.parse(val, convertIfDate));
		},

		/**
		 * Saves a value to a storage by the specified key
		 *
		 * @param key
		 * @param value
		 * @param [ttl]
		 */
		set(key: string, value: any, ttl?: number): any {
			storage.setItem(key, JSON.stringify(value));
			return wrap();
		},

		/**
		 * Removes a value from a storage by the specified key
		 * @param key
		 */
		remove(key: string): any {
			storage.removeItem(key);
			return wrap();
		},

		/**
		 * Clears a storage by the specified filter and returns a list of the removed keys
		 * @param [filter] - filter for removing (if not defined, then the storage will be cleared)
		 */
		clear(filter?: Function): any {
			if (filter) {
				$C(storage).forEach((el, key) => {
					if (filter(el, key)) {
						storage.removeItem(key);
					}
				});

			} else {
				storage.clear();
			}

			return wrap();
		},

		/**
		 * Returns a storage object by the specified namespace
		 * @param name
		 */
		namespace(name: string): any {
			const
				k = (key) => `${name}.${key}`;

			return {
				exists(key: string): boolean {
					return obj.exists(k(key));
				},

				get(key: string): any {
					return obj.get(k(key));
				},

				set(key: string, value: any, ttl?: number): any {
					return obj.set(k(key), value, ttl);
				},

				remove(key: string): any {
					return obj.remove(k(key));
				},

				clear(filter?: Function): any {
					$C(storage).forEach((el, key) => {
						if (key.split('.')[0] !== name) {
							return;
						}

						if (!filter || filter(el, key)) {
							storage.removeItem(key);
						}
					});

					return wrap();
				}
			};
		}
	};

	return obj;
}
