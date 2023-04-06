"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UncheckablePersistentEngine = exports.CheckablePersistentEngine = exports.AbstractPersistentEngine = void 0;
var _async = _interopRequireDefault(require("../../../../../core/async"));
class AbstractPersistentEngine {
  async = new _async.default();
  pending = new Map();
  constructor(storage) {
    this.storage = storage;
  }
  normalizeTTL(ttl) {
    let normalizedTTL = ttl != null ? Date.now() + ttl : Number.MAX_SAFE_INTEGER;
    if (!Number.isSafeInteger(ttl)) {
      normalizedTTL = Number.MAX_SAFE_INTEGER;
    }
    return normalizedTTL;
  }
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
exports.CheckablePersistentEngine = CheckablePersistentEngine;
class UncheckablePersistentEngine extends AbstractPersistentEngine {}
exports.UncheckablePersistentEngine = UncheckablePersistentEngine;