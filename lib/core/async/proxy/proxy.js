"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _core = _interopRequireWildcard(require("../../../core/async/core"));
var _const = require("../../../core/async/const");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
class Async extends _core.default {
  worker(worker, opts) {
    const {
      workerCache
    } = this;
    if (!workerCache.has(worker)) {
      workerCache.set(worker, true);
      worker[_core.asyncCounter] = Number(worker[_core.asyncCounter] ?? 0) + 1;
    }
    const clear = this.workerDestructor.bind(this, opts?.destructor);
    return this.registerTask({
      ...opts,
      task: worker,
      namespace: _const.PrimitiveNamespaces.worker,
      clear,
      periodic: opts?.single === false,
      onMerge(...args) {
        Array.toArray(opts?.onMerge).forEach(handler => {
          handler.apply(this, args);
        });
        clear(worker);
      }
    }) ?? worker;
  }
  terminateWorker(task) {
    return this.clearWorker(Object.cast(task));
  }
  clearWorker(task) {
    const namespace = (0, _core.isAsyncOptions)(task) && task.namespace || _const.PrimitiveNamespaces.worker;
    return this.cancelTask(task, namespace);
  }
  proxy(fn, opts) {
    return this.registerTask({
      ...opts,
      task: fn,
      namespace: opts?.namespace ?? _const.PrimitiveNamespaces.proxy,
      wrapper: fn => fn,
      linkByWrapper: true,
      periodic: opts?.single === false
    }) ?? Object.cast(() => undefined);
  }
  debounce(fn, delay, opts) {
    return this.proxy(fn, {
      ...opts,
      single: false
    }).debounce(delay);
  }
  throttle(fn, delay, opts) {
    return this.proxy(fn, {
      ...opts,
      single: false
    }).throttle(delay);
  }
  cancelProxy(task) {
    return this.clearProxy(Object.cast(task));
  }
  clearProxy(task) {
    const namespace = (0, _core.isAsyncOptions)(task) && task.namespace || _const.PrimitiveNamespaces.proxy;
    return this.cancelTask(task, namespace);
  }
  muteProxy(task) {
    const namespace = (0, _core.isAsyncOptions)(task) && task.namespace || _const.PrimitiveNamespaces.proxy;
    return this.markTask('muted', task, namespace);
  }
  unmuteProxy(task) {
    const namespace = (0, _core.isAsyncOptions)(task) && task.namespace || _const.PrimitiveNamespaces.proxy;
    return this.markTask('!muted', task, namespace);
  }
  suspendProxy(task) {
    const namespace = (0, _core.isAsyncOptions)(task) && task.namespace || _const.PrimitiveNamespaces.proxy;
    return this.markTask('paused', task, namespace);
  }
  unsuspendProxy(task) {
    const namespace = (0, _core.isAsyncOptions)(task) && task.namespace || _const.PrimitiveNamespaces.proxy;
    return this.markTask('!paused', task, namespace);
  }
  workerDestructor(destructor, worker) {
    const {
      workerCache
    } = this;
    if (workerCache.has(worker)) {
      workerCache.delete(worker);
      if (--worker[_core.asyncCounter] <= 0) {
        let fn;
        if (destructor != null) {
          fn = worker[destructor];
        } else if (Object.isSimpleFunction(worker)) {
          fn = worker;
        } else {
          fn = worker.terminate ?? worker.destroy ?? worker.destructor ?? worker.close ?? worker.abort ?? worker.cancel ?? worker.disconnect ?? worker.unwatch;
        }
        if (Object.isFunction(fn)) {
          fn.call(worker);
        } else {
          throw new ReferenceError('A function to destroy the worker is not defined');
        }
      }
    }
  }
}
exports.default = Async;