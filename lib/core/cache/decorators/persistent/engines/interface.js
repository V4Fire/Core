"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UncheckablePersistentEngine = exports.CheckablePersistentEngine = exports.AbstractPersistentEngine = void 0;

var _async = _interopRequireDefault(require("../../../../../core/async"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
class AbstractPersistentEngine {
  /**
   * API for asynchronous operations
   */
  async = new _async.default();
  /**
   * API to store data
   */

  /**
   * Map of pending operations by keys
   */
  pending = new Map();

  constructor(storage) {
    this.storage = storage;
  }
  /**
   * Sets a value to the storage by the specified key and ttl
   *
   * @param key
   * @param value
   * @param [ttl]
   */


  /**
   * Normalized the given TTL value and returns it
   * @param ttl
   */
  normalizeTTL(ttl) {
    let normalizedTTL = ttl != null ? Date.now() + ttl : Number.MAX_SAFE_INTEGER;

    if (!Number.isSafeInteger(ttl)) {
      normalizedTTL = Number.MAX_SAFE_INTEGER;
    }

    return normalizedTTL;
  }
  /**
   * Registers a task to update a cache item by the specified key
   *
   * @param key
   * @param task - function that doing something with the storage
   */


  async execTask(key, task) {
    if (this.pending.has(key)) {
      try {
        await this.pending.get(key);
      } catch (err) {
        stderr(err);
      }
    }

    let promise;

    try {
      await this.async.nextTick({
        label: key
      });

      promise = (async () => {
        try {
          return await task();
        } finally {
          this.pending.delete(key);
        }
      })();

      this.pending.set(key, promise);
    } catch (err) {
      stderr(err);
    }

    return promise;
  }

}

exports.AbstractPersistentEngine = AbstractPersistentEngine;

class CheckablePersistentEngine extends AbstractPersistentEngine {}
/**
 * A subtype of a persistent engine where `getCheckStorageState` will always return `available: false`.
 * It allows you not to implement the `get` method.
 */


exports.CheckablePersistentEngine = CheckablePersistentEngine;

class UncheckablePersistentEngine extends AbstractPersistentEngine {}
/**
 * Engine to provide the persistent feature
 */


exports.UncheckablePersistentEngine = UncheckablePersistentEngine;