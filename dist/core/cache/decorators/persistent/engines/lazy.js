"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sync = _interopRequireDefault(require("../../../../../core/promise/sync"));

var _const = require("../../../../../core/cache/decorators/persistent/engines/const");

var _interface = require("../../../../../core/cache/decorators/persistent/engines/interface");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
class LazyPersistentEngine extends _interface.CheckablePersistentEngine {
  get(key) {
    return _sync.default.resolve(this.storage.get(key));
  }

  async set(key, value, ttl) {
    await this.execTask(key, async () => {
      try {
        await this.storage.set(key, value);
      } finally {
        if (ttl != null) {
          await this.storage.set(key + _const.TTL_POSTFIX, this.normalizeTTL(ttl));
        } else {
          await this.removeTTLFrom(key);
        }
      }
    });
  }

  async remove(key) {
    await this.execTask(key, async () => {
      try {
        await this.storage.remove(key);
      } finally {
        await this.removeTTLFrom(key);
      }
    });
  }

  getTTLFrom(key) {
    return _sync.default.resolve(this.storage.get(key + _const.TTL_POSTFIX));
  }

  removeTTLFrom(key) {
    const ttlKey = key + _const.TTL_POSTFIX;
    return _sync.default.resolve(this.storage.has(ttlKey)).then(res => {
      if (res) {
        return _sync.default.resolve(this.storage.remove(ttlKey)).then(() => true);
      }

      return false;
    });
  }

  getCheckStorageState() {
    return {
      available: true,
      checked: true
    };
  }

}

exports.default = LazyPersistentEngine;