/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { AsyncEngineOptions, StoreMode } from '../../../../core/kv-storage/engines/browser-indexeddb/interface';
/**
 * Implementation of persistent asynchronous key-value storage based on IndexedDB
 */
export default class KVStorageIndexedDBEngine {
    protected db: Promise<IDBDatabase>;
    protected storeName: string;
    constructor({ dbName, storeName }?: AsyncEngineOptions);
    get(key: IDBValidKey): Promise<unknown>;
    set(key: IDBValidKey, value: unknown): Promise<void>;
    remove(key: IDBValidKey): Promise<void>;
    keys(): Promise<IDBValidKey[]>;
    clear(): Promise<void>;
    protected getStore(mode: StoreMode): Promise<IDBObjectStore>;
}
