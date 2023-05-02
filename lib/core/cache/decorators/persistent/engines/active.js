"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sync = _interopRequireDefault(require("../../../../../core/promise/sync"));
var _const = require("../../../../../core/cache/decorators/persistent/engines/const");
var _interface = require("../../../../../core/cache/decorators/persistent/engines/interface");
class ActivePersistentEngine extends _interface.UncheckablePersistentEngine {
  ttlIndex = Object.createDict();
  async initCache(cache) {
    if (await this.storage.has(_const.INDEX_STORAGE_NAME)) {
      this.ttlIndex = await this.storage.get(_const.INDEX_STORAGE_NAME);
    } else {
      await this.storage.set(_const.INDEX_STORAGE_NAME, this.storage);
    }
    const time = Date.now();
    await Promise.allSettled(Object.keys(this.ttlIndex).map(key => new Promise(async resolve => {
      const ttl = this.ttlIndex[key];
      if (!Object.isNumber(ttl)) {
        return;
      }
      if (ttl > time) {
        const value = await this.storage.get(key);
        cache.set(key, value);
      } else {
        await this.remove(key);
      }
      resolve();
    })));
  }
  async set(key, value, ttl) {
    await this.execTask(key, async () => {
      const res = await this.storage.set(key, value);
      this.ttlIndex[key] = this.normalizeTTL(ttl);
      await this.storage.set(_const.INDEX_STORAGE_NAME, Object.fastClone(this.ttlIndex));
      return res;
    });
  }
  async remove(key) {
    await this.execTask(key, async () => {
      await this.storage.remove(key);
      await this.removeTTLFrom(key);
    });
  }
  getTTLFrom(key) {
    return _sync.default.resolve(this.ttlIndex[key]);
  }
  removeTTLFrom(key) {
    if (key in this.ttlIndex) {
      delete this.ttlIndex[key];
      return _sync.default.resolve(this.storage.set(_const.INDEX_STORAGE_NAME, Object.fastClone(this.ttlIndex)));
    }
    return _sync.default.resolve(false);
  }
  getCheckStorageState() {
    return {
      available: false,
      checked: true
    };
  }
}
exports.default = ActivePersistentEngine;