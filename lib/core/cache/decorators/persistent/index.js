"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;

var _wrapper = _interopRequireDefault(require("../../../../core/cache/decorators/persistent/wrapper"));

var _interface = require("../../../../core/cache/decorators/persistent/interface");

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
 * [[include:core/cache/decorators/persistent/README.md]]
 * @packageDocumentation
 */

/**
 * Wraps the specified cache object to add a feature of persistent data storing
 *
 * @typeparam V - value type of the cache object
 *
 * @param cache - cache object to wrap
 * @param storage - storage to save data
 * @param [opts] - additional options
 *
 * @example
 * ```typescript
 * import { asyncLocal } from '../../../../core/kv-storage';
 *
 * import addPersistent from '../../../../core/cache/decorators/persistent';
 * import SimpleCache from '../../../../core/cache/simple';
 *
 * const
 *   opts = {loadFromStorage: 'onInit'},
 *   persistentCache = await addPersistent(new SimpleCache(), asyncLocal, opts);
 *
 * await persistentCache.set('foo', 'bar', {persistentTTL: (2).seconds()});
 * await persistentCache.set('foo2', 'bar2');
 *
 * // Cause we use the same instance for the local data storing,
 * // this cache will have all values from the previous (it will be loaded from the storage during initialization)
 *
 * const
 *   copyOfCache = await addPersistent(new SimpleCache(), asyncLocal, opts);
 * ```
 */
const addPersistent = (cache, storage, opts) => new _wrapper.default(cache, storage, opts).getInstance();

var _default = addPersistent;
exports.default = _default;