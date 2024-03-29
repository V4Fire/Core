"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sync = _interopRequireDefault(require("../../../../core/promise/sync"));
var _engines = _interopRequireDefault(require("../../../../core/cache/decorators/persistent/engines"));
var _addEmitter = _interopRequireDefault(require("../../../../core/cache/decorators/helpers/add-emitter"));
class PersistentWrapper {
  fetchedItems = new Set();
  constructor(cache, storage, opts) {
    this.ttl = opts?.persistentTTL;
    this.cache = cache;
    this.wrappedCache = Object.create(cache);
    this.engine = new _engines.default[opts?.loadFromStorage ?? 'onDemand'](storage);
  }
  async getInstance() {
    if (this.engine.initCache) {
      await this.engine.initCache(this.cache);
    }
    this.implementAPI();
    return this.wrappedCache;
  }
  implementAPI() {
    const {
      remove: originalRemove,
      set: originalSet,
      clear: originalClear,
      subscribe
    } = (0, _addEmitter.default)(this.cache);
    this.wrappedCache.has = this.getDefaultImplementation('has');
    this.wrappedCache.get = this.getDefaultImplementation('get');
    this.wrappedCache.set = async (key, value, opts) => {
      const ttl = opts?.persistentTTL ?? this.ttl;
      this.fetchedItems.add(key);
      const res = originalSet(key, value, opts);
      if (this.cache.has(key)) {
        await this.engine.set(key, value, ttl);
      }
      return res;
    };
    this.wrappedCache.remove = async key => {
      this.fetchedItems.add(key);
      await this.engine.remove(key);
      return originalRemove(key);
    };
    this.wrappedCache.keys = () => _sync.default.resolve(this.cache.keys());
    this.wrappedCache.clear = async filter => {
      const removed = originalClear(filter),
        removedKeys = [];
      removed.forEach((_, key) => {
        removedKeys.push(key);
      });
      await Promise.allSettled(removedKeys.map(key => this.engine.remove(key)));
      return removed;
    };
    this.wrappedCache.removePersistentTTLFrom = key => this.engine.removeTTLFrom(key);
    subscribe('remove', this.wrappedCache, ({
      args
    }) => this.engine.remove(args[0]));
    subscribe('set', this.wrappedCache, ({
      args
    }) => {
      const ttl = args[2]?.persistentTTL ?? this.ttl;
      return this.engine.set(args[0], args[1], ttl);
    });
    subscribe('clear', this.wrappedCache, ({
      result
    }) => {
      result.forEach((_, key) => this.engine.remove(key));
    });
  }
  getDefaultImplementation(method) {
    return key => {
      if (this.fetchedItems.has(key)) {
        return _sync.default.resolve(this.cache[method](key));
      }
      return _sync.default.resolve(this.engine.getCheckStorageState(method, key)).then(state => {
        if (state.checked) {
          this.fetchedItems.add(key);
        }
        if (state.available) {
          return this.checkItemInStorage(key).then(() => this.cache[method](key));
        }
        return this.cache[method](key);
      });
    };
  }
  checkItemInStorage(key) {
    return this.engine.getTTLFrom(key).then(ttl => {
      const time = Date.now();
      if (ttl != null && ttl < time) {
        return this.engine.remove(key);
      }
      const val = this.engine.get(key);
      return _sync.default.resolve(val).then(val => {
        if (val != null) {
          return this.cache.set(key, val);
        }
      });
    });
  }
}
exports.default = PersistentWrapper;