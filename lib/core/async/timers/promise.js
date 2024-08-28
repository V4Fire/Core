"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sync = _interopRequireDefault(require("../../../core/promise/sync"));
var _callbacks = _interopRequireDefault(require("../../../core/async/timers/callbacks"));
var _const = require("../../../core/async/const");
class Async extends _callbacks.default {
  sleep(timeout, opts) {
    return new _sync.default((resolve, reject) => {
      this.setTimeout(resolve, timeout, {
        ...opts,
        promise: _const.PromiseNamespaces.timeoutPromise,
        onClear: this.onPromiseClear(resolve, reject),
        onMerge: this.onPromiseMerge(resolve, reject)
      });
    });
  }
  nextTick(opts) {
    return new _sync.default((resolve, reject) => {
      this.setImmediate(resolve, {
        ...opts,
        promise: _const.PromiseNamespaces.immediatePromise,
        onClear: this.onPromiseClear(resolve, reject),
        onMerge: this.onPromiseMerge(resolve, reject)
      });
    });
  }
  idle(opts) {
    return new _sync.default((resolve, reject) => {
      this.requestIdleCallback(resolve, {
        ...opts,
        promise: _const.PromiseNamespaces.idleCallbackPromise,
        onClear: this.onPromiseClear(resolve, reject),
        onMerge: this.onPromiseMerge(resolve, reject)
      });
    });
  }
  animationFrame(p) {
    return new _sync.default((resolve, reject) => {
      if (Object.isPlainObject(p)) {
        return this.requestAnimationFrame(resolve, {
          ...p,
          promise: _const.PromiseNamespaces.animationFramePromise,
          element: p.element,
          onClear: this.onPromiseClear(resolve, reject)
        });
      }
      return this.requestAnimationFrame(resolve, {
        promise: _const.PromiseNamespaces.animationFramePromise,
        element: p,
        onClear: this.onPromiseClear(resolve, reject)
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
          if (id != null) {
            this.clearInterval(id);
          }
        }
      };
      id = this.setInterval(cb, opts?.delay ?? 15, {
        ...opts,
        promise: _const.PromiseNamespaces.intervalPromise,
        onClear: this.onPromiseClear(resolve, reject),
        onMerge: this.onPromiseMerge(resolve, reject)
      });
    });
  }
}
exports.default = Async;