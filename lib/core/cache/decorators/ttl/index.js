"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = addTTL;

var _addEmitter = _interopRequireDefault(require("../../../../core/cache/decorators/helpers/add-emitter"));

var _interface = require("../../../../core/cache/decorators/ttl/interface");

Object.keys(_interface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface[key];
    }
  });
});

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/cache/decorators/ttl/README.md]]
 * @packageDocumentation
 */

/**
 * Wraps the specified cache object to add a feature of the cache expiring
 *
 * @typeparam V - value type of the cache object
 * @typeparam K - key type of the cache object
 *
 * @param cache - cache object to wrap
 * @param ttl - default ttl value in milliseconds
 *
 * @example
 * ```typescript
 * import addTTL from '../../../../core/cache/decorators/ttl';
 * import SimpleCache from '../../../../core/cache/simple';
 *
 * const
 *   cache = addTTL(new SimpleCache(), (10).seconds());
 *
 * cache.add('foo', 'bar1', {ttl: 0.5.seconds()});
 * cache.add('foo2', 'bar2');
 * ```
 */
function addTTL(cache, ttl) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    remove: originalRemove,
    set: originalSet,
    clear: originalClear,
    subscribe
  } = (0, _addEmitter.default)(cache);
  const cacheWithTTL = Object.create(cache),
        ttlTimers = new Map();

  cacheWithTTL.set = (key, value, opts) => {
    updateTTL(key, opts?.ttl);
    return originalSet(key, value, opts);
  };

  cacheWithTTL.remove = key => {
    cacheWithTTL.removeTTLFrom(key);
    return originalRemove(key);
  };

  cacheWithTTL.removeTTLFrom = key => {
    if (ttlTimers.has(key)) {
      clearTimeout(ttlTimers.get(key));
      ttlTimers.delete(key);
      return true;
    }

    return false;
  };

  cacheWithTTL.clear = filter => {
    const removed = originalClear(filter);
    removed.forEach((_, key) => {
      cacheWithTTL.removeTTLFrom(key);
    });
    return removed;
  };

  subscribe('remove', cacheWithTTL, ({
    args
  }) => cacheWithTTL.removeTTLFrom(args[0]));
  subscribe('set', cacheWithTTL, ({
    args
  }) => updateTTL(args[0], args[2]?.ttl));
  subscribe('clear', cacheWithTTL, ({
    result
  }) => {
    result.forEach((_, key) => cacheWithTTL.removeTTLFrom(key));
  });
  return cacheWithTTL;

  function updateTTL(key, optionTTL) {
    if (optionTTL != null || ttl != null) {
      const time = optionTTL ?? ttl;
      ttlTimers.set(key, setTimeout(() => cacheWithTTL.remove(key), time));
    } else {
      cacheWithTTL.removeTTLFrom(key);
    }
  }
}