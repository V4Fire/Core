"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;

var _sync = _interopRequireDefault(require("../../../../core/promise/sync"));

var _proxy = _interopRequireWildcard(require("../../../../core/async/modules/proxy"));

Object.keys(_proxy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _proxy[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _proxy[key];
    }
  });
});

var _interface = require("../../../../core/async/interface");

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
 * [[include:core/async/modules/timers/README.md]]
 * @packageDocumentation
 */
class Async extends _proxy.default {
  /**
   * Wrapper for `globalThis.setImmediate`
   *
   * @param cb - callback function
   * @param [opts] - additional options for the operation
   */
  setImmediate(cb, opts) {
    return this.registerTask({ ...opts,
      name: this.namespaces.immediate,
      obj: cb,
      clearFn: clearImmediate,
      wrapper: setImmediate,
      linkByWrapper: true
    });
  }
  /**
   * Wrapper for `globalThis.clearImmediate`
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  clearImmediate(task) {
    return this.cancelTask(task, this.namespaces.immediate);
  }
  /**
   * Mutes the specified "setImmediate" timer
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  muteImmediate(task) {
    return this.markTask('muted', task, this.namespaces.immediate);
  }
  /**
   * Unmutes the specified "setImmediate" timer
   * @param [id] - operation id (if not defined will be get all handlers)
   */


  unmuteImmediate(p) {
    return this.markTask('!muted', p, this.namespaces.immediate);
  }
  /**
   * Suspends the specified "setImmediate" timer
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  suspendImmediate(p) {
    return this.markTask('paused', p, this.namespaces.immediate);
  }
  /**
   * Unsuspends the specified "setImmediate" timer
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  unsuspendImmediate(p) {
    return this.markTask('!paused', p, this.namespaces.immediate);
  }
  /**
   * Wrapper for `globalThis.setInterval`
   *
   * @param cb - callback function
   * @param timeout - timer value
   * @param [opts] - additional options for the operation
   */


  setInterval(cb, timeout, opts) {
    return this.registerTask({ ...opts,
      name: this.namespaces.interval,
      obj: cb,
      clearFn: clearInterval,
      wrapper: setInterval,
      linkByWrapper: true,
      periodic: true,
      args: [timeout]
    });
  }
  /**
   * Wrapper for `globalThis.clearInterval`
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  clearInterval(task) {
    return this.cancelTask(task, this.namespaces.interval);
  }
  /**
   * Mutes the specified "setInterval" timer
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  muteInterval(task) {
    return this.markTask('muted', task, this.namespaces.interval);
  }
  /**
   * Unmutes the specified "setInterval" timer
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  unmuteInterval(task) {
    return this.markTask('!muted', task, this.namespaces.interval);
  }
  /**
   * Suspends the specified "setInterval" timer
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  suspendInterval(task) {
    return this.markTask('paused', task, this.namespaces.interval);
  }
  /**
   * Unsuspends the specified "setImmediate" timer
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  unsuspendInterval(task) {
    return this.markTask('!paused', task, this.namespaces.interval);
  }
  /**
   * Wrapper for `globalThis.setTimeout`
   *
   * @param cb - callback function
   * @param timeout - timeout value
   * @param [opts] - additional options for the operation
   */


  setTimeout(cb, timeout, opts) {
    return this.registerTask({ ...opts,
      name: this.namespaces.timeout,
      obj: cb,
      clearFn: clearTimeout,
      wrapper: setTimeout,
      linkByWrapper: true,
      args: [timeout]
    });
  }
  /**
   * Wrapper for `globalThis.clearTimeout`
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  clearTimeout(task) {
    return this.cancelTask(task, this.namespaces.timeout);
  }
  /**
   * Mutes the specified "setTimeout" timer
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  muteTimeout(task) {
    return this.markTask('muted', task, this.namespaces.timeout);
  }
  /**
   * Unmutes the specified "setTimeout" timer
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  unmuteTimeout(task) {
    return this.markTask('!muted', task, this.namespaces.timeout);
  }
  /**
   * Suspends the specified "setTimeout" timer
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  suspendTimeout(task) {
    return this.markTask('paused', task, this.namespaces.timeout);
  }
  /**
   * Unsuspends the specified "setTimeout" timer
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  unsuspendTimeout(task) {
    return this.markTask('!paused', task, this.namespaces.timeout);
  }
  /**
   * Wrapper for `globalThis.requestIdleCallback`
   *
   * @param cb - callback function
   * @param [opts] - additional options for the operation
   */


  requestIdleCallback(cb, opts) {
    let wrapper, clearFn;

    if (typeof requestIdleCallback !== 'function') {
      wrapper = fn => setTimeout(() => fn({
        timeRemaining: () => 0
      }), 50);

      clearFn = clearTimeout;
    } else {
      wrapper = requestIdleCallback;
      clearFn = cancelIdleCallback;
    }

    return this.registerTask({ ...(opts && Object.reject(opts, 'timeout')),
      name: this.namespaces.idleCallback,
      obj: cb,
      clearFn,
      wrapper,
      linkByWrapper: true,
      args: opts && Object.select(opts, 'timeout')
    });
  }
  /**
   * Wrapper for `globalThis.cancelIdleCallback`
   *
   * @alias
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  cancelIdleCallback(task) {
    return this.clearIdleCallback(Object.cast(task));
  }
  /**
   * Wrapper for `globalThis.cancelIdleCallback`
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  clearIdleCallback(task) {
    return this.cancelTask(task, this.namespaces.idleCallback);
  }
  /**
   * Mutes the specified "requestIdleCallback" timer
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  muteIdleCallback(task) {
    return this.markTask('muted', task, this.namespaces.idleCallback);
  }
  /**
   * Unmutes the specified "requestIdleCallback" timer
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  unmuteIdleCallback(task) {
    return this.markTask('!muted', task, this.namespaces.idleCallback);
  }
  /**
   * Suspends the specified "requestIdleCallback" timer
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  suspendIdleCallback(task) {
    return this.markTask('paused', task, this.namespaces.idleCallback);
  }
  /**
   * Unsuspends the specified "requestIdleCallback" timer
   * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
   */


  unsuspendIdleCallback(task) {
    return this.markTask('!paused', task, this.namespaces.idleCallback);
  }
  /**
   * Returns a promise that will be resolved after the specified timeout
   *
   * @param timeout
   * @param [opts] - additional options for the operation
   */


  sleep(timeout, opts) {
    return new _sync.default((resolve, reject) => {
      this.setTimeout(resolve, timeout, { ...opts,
        promise: true,
        onClear: this.onPromiseClear(resolve, reject),
        onMerge: this.onPromiseMerge(resolve, reject)
      });
    });
  }
  /**
   * Returns a promise that will be resolved on the next tick of the event loop
   * @param [opts] - additional options for the operation
   */


  nextTick(opts) {
    return new _sync.default((resolve, reject) => {
      this.setImmediate(resolve, { ...opts,
        promise: true,
        onClear: this.onPromiseClear(resolve, reject),
        onMerge: this.onPromiseMerge(resolve, reject)
      });
    });
  }
  /**
   * Returns a promise that will be resolved on the process idle
   * @param [opts] - additional options for the operation
   */


  idle(opts) {
    return new _sync.default((resolve, reject) => {
      this.requestIdleCallback(resolve, { ...opts,
        promise: true,
        onClear: this.onPromiseClear(resolve, reject),
        onMerge: this.onPromiseMerge(resolve, reject)
      });
    });
  }
  /**
   * Returns a promise that will be resolved only when the specified function returns a positive value (== true)
   *
   * @param fn
   * @param [opts] - additional options for the operation
   */


  wait(fn, opts) {
    if (Object.isTruly(fn())) {
      if (opts?.label != null) {
        this.clearPromise(opts);
      }

      return _sync.default.resolve(true);
    }

    return new _sync.default((resolve, reject) => {
      let // eslint-disable-next-line prefer-const
      id;

      const cb = () => {
        if (Object.isTruly(fn())) {
          resolve(true);
          this.clearPromise(id);
        }
      };

      id = this.setInterval(cb, opts?.delay ?? 15, { ...opts,
        promise: true,
        onClear: this.onPromiseClear(resolve, reject),
        onMerge: this.onPromiseMerge(resolve, reject)
      });
    });
  }

}

exports.default = Async;