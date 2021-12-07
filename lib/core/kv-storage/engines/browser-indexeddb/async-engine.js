"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Implementation of persistent asynchronous key-value storage based on IndexedDB
 */
class KVStorageIndexedDBEngine {
  constructor({
    dbName = 'kv-storage-db',
    storeName = 'kv-storage'
  } = {}) {
    this.storeName = storeName;
    const openRequest = indexedDB.open(dbName);
    this.db = new Promise(r => {
      openRequest.onupgradeneeded = () => {
        const db = openRequest.result;

        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };

      openRequest.onsuccess = () => {
        r(openRequest.result);
      };
    });
  }

  async get(key) {
    const store = await this.getStore('readonly');
    return promisifyRequestToStore(store.get(key));
  }

  async set(key, value) {
    const store = await this.getStore('readwrite');
    await promisifyRequestToStore(store.put(value, key));
  }

  async remove(key) {
    const store = await this.getStore('readwrite');
    await promisifyRequestToStore(store.delete(key));
  }

  async keys() {
    const store = await this.getStore('readonly'); // eslint-disable-next-line @typescript-eslint/unbound-method

    if (Object.isFunction(store.getAllKeys)) {
      return promisifyRequestToStore(store.getAllKeys());
    }

    return new Promise((resolve, reject) => {
      const request = store.openCursor(),
            keys = [];

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        const cursor = request.result;

        if (cursor) {
          keys.push(cursor.primaryKey);
          cursor.continue();
        } else {
          resolve(keys);
        }
      };
    });
  }

  async clear() {
    const store = await this.getStore('readwrite');
    return promisifyRequestToStore(store.clear());
  }

  async getStore(mode) {
    const db = await this.db;
    return db.transaction(this.storeName, mode).objectStore(this.storeName);
  }

}

exports.default = KVStorageIndexedDBEngine;

function promisifyRequestToStore(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);

    request.onerror = () => reject(request.error);
  });
}