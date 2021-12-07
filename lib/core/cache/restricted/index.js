"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;

var _simple = _interopRequireWildcard(require("../../../core/cache/simple"));

Object.keys(_simple).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _simple[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _simple[key];
    }
  });
});

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/cache/restricted/README.md]]
 * @packageDocumentation
 */

/**
 * Implementation for an in-memory data structure with support for limiting of values in the cache
 *
 * @typeparam V - value type
 * @typeparam K - key type (`string` by default)
 */
class RestrictedCache extends _simple.default {
  /**
   * Queue object
   */
  queue = new Set();
  /**
   * Number of maximum records in the cache
   */

  capacity = 20;
  /**
   * @override
   * @param [max] - number of maximum records in the cache
   */

  constructor(max) {
    super();

    if (max != null) {
      this.setCapacity(max);
    }
  }

  get(key) {
    if (this.has(key)) {
      this.queue.delete(key);
      this.queue.add(key);
    }

    return super.get(key);
  }

  set(key, value) {
    this.queue.delete(key);

    if (this.queue.size === this.capacity) {
      const key = this.queue.values().next().value;

      if (key !== undefined) {
        this.remove(key);
      }
    }

    this.queue.add(key);
    return super.set(key, value);
  }

  remove(key) {
    if (this.has(key)) {
      this.queue.delete(key);
      return super.remove(key);
    }
  }

  clear(filter) {
    const removed = super.clear(filter);

    for (let o = this.queue.values(), i = o.next(); !i.done; i = o.next()) {
      const el = i.value;

      if (removed.has(el)) {
        this.queue.delete(el);
      }
    }

    return removed;
  }
  /**
   * Sets a new capacity of the cache.
   * The method returns a map of truncated elements that the cache can't fit anymore.
   *
   * @param value
   */


  setCapacity(value) {
    if (!Number.isInteger(value) || value < 0) {
      throw new TypeError('A value of `max` can be defined only as a non-negative integer number');
    }

    const removed = new Map(),
          amount = value - this.capacity;
    this.capacity = value;

    if (amount < 0) {
      while (this.capacity < this.queue.size) {
        const key = this.queue.values().next().value,
              el = this.remove(key);

        if (el) {
          removed.set(key, el);
        }
      }
    }

    return removed;
  }

}

exports.default = RestrictedCache;