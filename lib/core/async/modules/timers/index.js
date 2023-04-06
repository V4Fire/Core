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
class Async extends _proxy.default {
  setImmediate(cb, opts) {
    return this.registerTask({
      ...opts,
      name: this.namespaces.immediate,
      obj: cb,
      clearFn: clearImmediate,
      wrapper: setImmediate,
      linkByWrapper: true
    });
  }
  clearImmediate(task) {
    return this.cancelTask(task, this.namespaces.immediate);
  }
  muteImmediate(task) {
    return this.markTask('muted', task, this.namespaces.immediate);
  }
  unmuteImmediate(p) {
    return this.markTask('!muted', p, this.namespaces.immediate);
  }
  suspendImmediate(p) {
    return this.markTask('paused', p, this.namespaces.immediate);
  }
  unsuspendImmediate(p) {
    return this.markTask('!paused', p, this.namespaces.immediate);
  }
  setInterval(cb, timeout, opts) {
    return this.registerTask({
      ...opts,
      name: this.namespaces.interval,
      obj: cb,
      clearFn: clearInterval,
      wrapper: setInterval,
      linkByWrapper: true,
      periodic: true,
      args: [timeout]
    });
  }
  clearInterval(task) {
    return this.cancelTask(task, this.namespaces.interval);
  }
  muteInterval(task) {
    return this.markTask('muted', task, this.namespaces.interval);
  }
  unmuteInterval(task) {
    return this.markTask('!muted', task, this.namespaces.interval);
  }
  suspendInterval(task) {
    return this.markTask('paused', task, this.namespaces.interval);
  }
  unsuspendInterval(task) {
    return this.markTask('!paused', task, this.namespaces.interval);
  }
  setTimeout(cb, timeout, opts) {
    return this.registerTask({
      ...opts,
      name: this.namespaces.timeout,
      obj: cb,
      clearFn: clearTimeout,
      wrapper: setTimeout,
      linkByWrapper: true,
      args: [timeout]
    });
  }
  clearTimeout(task) {
    return this.cancelTask(task, this.namespaces.timeout);
  }
  muteTimeout(task) {
    return this.markTask('muted', task, this.namespaces.timeout);
  }
  unmuteTimeout(task) {
    return this.markTask('!muted', task, this.namespaces.timeout);
  }
  suspendTimeout(task) {
    return this.markTask('paused', task, this.namespaces.timeout);
  }
  unsuspendTimeout(task) {
    return this.markTask('!paused', task, this.namespaces.timeout);
  }
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
    return this.registerTask({
      ...(opts && Object.reject(opts, 'timeout')),
      name: this.namespaces.idleCallback,
      obj: cb,
      clearFn,
      wrapper,
      linkByWrapper: true,
      args: opts && Object.select(opts, 'timeout')
    });
  }
  cancelIdleCallback(task) {
    return this.clearIdleCallback(Object.cast(task));
  }
  clearIdleCallback(task) {
    return this.cancelTask(task, this.namespaces.idleCallback);
  }
  muteIdleCallback(task) {
    return this.markTask('muted', task, this.namespaces.idleCallback);
  }
  unmuteIdleCallback(task) {
    return this.markTask('!muted', task, this.namespaces.idleCallback);
  }
  suspendIdleCallback(task) {
    return this.markTask('paused', task, this.namespaces.idleCallback);
  }
  unsuspendIdleCallback(task) {
    return this.markTask('!paused', task, this.namespaces.idleCallback);
  }
  sleep(timeout, opts) {
    return new _sync.default((resolve, reject) => {
      this.setTimeout(resolve, timeout, {
        ...opts,
        promise: true,
        onClear: this.onPromiseClear(resolve, reject),
        onMerge: this.onPromiseMerge(resolve, reject)
      });
    });
  }
  nextTick(opts) {
    return new _sync.default((resolve, reject) => {
      this.setImmediate(resolve, {
        ...opts,
        promise: true,
        onClear: this.onPromiseClear(resolve, reject),
        onMerge: this.onPromiseMerge(resolve, reject)
      });
    });
  }
  idle(opts) {
    return new _sync.default((resolve, reject) => {
      this.requestIdleCallback(resolve, {
        ...opts,
        promise: true,
        onClear: this.onPromiseClear(resolve, reject),
        onMerge: this.onPromiseMerge(resolve, reject)
      });
    });
  }
  wait(fn, opts) {
    if (Object.isTruly(fn())) {
      if (opts?.label != null) {
        this.clearPromise(opts);
      }
      return _sync.default.resolve(true);
    }
    return new _sync.default((resolve, reject) => {
      let id;
      const cb = () => {
        if (Object.isTruly(fn())) {
          resolve(true);
          this.clearPromise(id);
        }
      };
      id = this.setInterval(cb, opts?.delay ?? 15, {
        ...opts,
        promise: true,
        onClear: this.onPromiseClear(resolve, reject),
        onMerge: this.onPromiseMerge(resolve, reject)
      });
    });
  }
}
exports.default = Async;