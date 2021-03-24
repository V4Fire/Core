/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/cache/simple/README.md]]
 * @packageDocumentation
 */
import type Cache from 'core/cache/interface';
import type { PersistentOptions, PersistentCache } from 'core/cache/interface';

import { isOnline } from 'core/net';
import type { SyncStorageNamespace, AsyncStorageNamespace } from 'core/kv-storage';

export * from 'core/cache/interface';

const ttlPostfix = '__ttl';
const inMemoryPath = '__storage__';

export class StorageManager {
	private memory: {
		[key: string]: {
			value?: unknown;
			action: 'set' | 'remove';
			callback?(): void;
		};
	} = {};
	private readonly storage: SyncStorageNamespace | AsyncStorageNamespace;
	private promise: Promise<unknown> = Promise.resolve();

	constructor(storage: SyncStorageNamespace | AsyncStorageNamespace) {
		this.storage = storage;
	}

	public set(key: string, value: unknown, callback?: () => void): void {
		this.changeElement(key, {
			action: 'set',
			value,
			callback
		});
	}

	public remove(key: string, callback?: () => void): void {
		this.changeElement(key, {
			action: 'remove',
			callback
		});
	}

	private changeElement(key: string, parameters: {
		action: 'set';
		value: unknown;
		callback?(): void;
	} | {
		action: 'remove';
		callback?(): void;
	}): void {
		this.memory[key] = parameters;

		if (Object.keys(this.memory).length === 1) {
			this.promise = this.promise.then(async () => {
				await this.makeIteration();
			});
		}
	}

	private async makeIteration() {
		const
			clone = {...this.memory};
		this.memory = {};

		await Promise.all(Object.keys(clone).map((key) => {
			const promiseForKey = new Promise<void>(async (resolve) => {
				if (clone[key].action === 'remove') {
					await this.storage.remove(key);
				} else {
					await this.storage.set(key, clone[key].value);
				}

				const
					cb = clone[key].callback;

				if (cb) {
					cb();
				}

				resolve();
			});
			return promiseForKey;
		}));
	}
}

class PersistentWrapper<V = unknown> {
	private readonly cacheWithStorage: PersistentCache<V, string>;
	private readonly cache: Cache<V, string>;
	private readonly kvStorage: SyncStorageNamespace | AsyncStorageNamespace;
	private readonly options: PersistentOptions;
	private readonly StorageManager: StorageManager;
	private storage: {[key: string]: number} = {};

	constructor(
		cache: Cache<V, string>,
		kvStorage: SyncStorageNamespace | AsyncStorageNamespace,
		options: PersistentOptions
	) {
		this.cacheWithStorage = Object.create(cache);
		this.cache = cache;
		this.kvStorage = kvStorage;
		this.options = options;
		this.StorageManager = new StorageManager(kvStorage);
	}

	public async getInstance(): Promise<PersistentCache<V, string>> {
		await this.init();
		this.replaceHasMethod();
		return this.cacheWithStorage;
	}

	private async init(): Promise<void> {
		if (await this.kvStorage.has(inMemoryPath)) {
			this.storage = (await this.kvStorage.get<{[key: string]: number}>(inMemoryPath))!;
		} else {
			await this.kvStorage.set(inMemoryPath, this.storage);
		}

		if (this.options.initializationStrategy === 'active') {
			const time = Date.now();

			await Promise.all(Object.keys(this.storage).map((key) => {
				const promiseInitProp = new Promise<void>(async (resolve) => {
					if (this.storage[key] > time) {
						const value = (await this.kvStorage.get<V>(key))!;
						await this.cacheWithStorage.set(key, value);
					} else {
						this.StorageManager.remove(key, () => {
							delete this.storage[key];
							const copyOfStorage = {...this.storage};
							this.StorageManager.set(inMemoryPath, copyOfStorage);
						});
					}

					resolve();
				});

				return promiseInitProp;
			}));
		}
	}

	private replaceHasMethod(): void {
		this.cacheWithStorage.has = async (key: string) => {
			if (this.options.initializationStrategy === 'active') {
				return this.cache.has(key);
			}

			const
				online = (await isOnline()).status;

			if (options.readFromMemoryStrategy === 'connection loss' && online) {
				return cache.has(key);
			}

			if (options.initializationStrategy === 'lazy') {
				if (wasFetched.has(key)) {
					return cache.has(key);
				}

				wasFetched.add(key);
				const value = await kvStorage.has(key) && await kvStorage.get<V>(key);

				if (value != null && value !== false) {
					const timeStampTTL = await kvStorage.has(`${key}${ttlPostfix}`) && await kvStorage.get<number>(`${key}${ttlPostfix}`);

					if (timeStampTTL != null && timeStampTTL > timeNow) {
						cache.set(key, value);
						return true;
					}
				}

				return cache.has(key);

			}

			return cache.has(key);
		};
	}
}

export default PersistentWrapper;
