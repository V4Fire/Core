/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

function promisifyRequestToStore<T>(request: IDBRequest<T>): Promise<T> {
	return new Promise((resolve, reject) => {
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

/**
 * Asynchronous implementation of persistent key-value storage based on IndexedDB
 */
export default class KVStorageIndexedDBEngine {
	protected db: Promise<IDBDatabase>;

	protected storeName: string;

	constructor({dbName = 'kv-storage-db', storeName = 'kv-storage'}: {dbName?: string; storeName?: string} = {}) {
		this.storeName = storeName;

		const
			openRequest = indexedDB.open(dbName);

		this.db = new Promise((r) => {
			openRequest.onupgradeneeded = () => {
				const
					db = openRequest.result;

				if (!db.objectStoreNames.contains(storeName)) {
					db.createObjectStore(storeName);
				}
			};

			openRequest.onsuccess = () => {
				r(openRequest.result);
			};
		});
	}

	async get(key: IDBValidKey): Promise<unknown> {
		const
			store = await this.getStore('readonly');

		return promisifyRequestToStore(store.get(key));
	}

	async set(key: IDBValidKey, value: unknown): Promise<void> {
		const
			store = await this.getStore('readwrite');

		await promisifyRequestToStore(store.put(value, key));
	}

	async remove(key: IDBValidKey): Promise<void> {
		const
			store = await this.getStore('readwrite');

		await promisifyRequestToStore(store.delete(key));
	}

	async keys(): Promise<IDBValidKey[]> {
		const
			store = await this.getStore('readonly');

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (store.getAllKeys !== undefined) {
			return promisifyRequestToStore(store.getAllKeys());
		}

		return new Promise((resolve, reject) => {
			const
				request = store.openCursor(),
				keys: IDBValidKey[] = [];

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				const
					cursor = request.result;

				if (cursor) {
					keys.push(cursor.primaryKey);
					cursor.continue();

				} else {
					resolve(keys);
				}
			};
		});
	}

	async clear(): Promise<void> {
		const
			store = await this.getStore('readwrite');

		return promisifyRequestToStore(store.clear());
	}

	protected async getStore(mode: 'readwrite' | 'readonly'): Promise<IDBObjectStore> {
		const
			db = await this.db;

		return db.transaction(this.storeName, mode).objectStore(this.storeName);
	}
}
