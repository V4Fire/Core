"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _sync = _interopRequireDefault(require("../../../core/promise/sync"));
var _proxy = _interopRequireDefault(require("../../../core/async/proxy/proxy"));
var _const = require("../../../core/async/const");
var _core = require("../../../core/async/core");
Object.keys(_core).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _core[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _core[key];
    }
  });
});
var _interface = require("../../../core/async/interface");
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
class Async extends _proxy.default {
  promise(promise, opts) {
    if (!Object.isTruly(promise)) {
      return _sync.default.resolve();
    }
    const that = this,
      {
        ctx
      } = this;
    const p = {
      namespace: _const.PrimitiveNamespaces.promise,
      ...opts
    };
    let wrappedResolve;
    const wrappedPromise = new _sync.default(promiseConstructor);
    this.ids.set(wrappedPromise, wrappedResolve);
    return wrappedPromise;
    function promiseConstructor(resolve, reject) {
      let canceled = false;
      let wrappedReject = null;
      wrappedResolve = that.proxy(resolve, {
        ...p,
        clear: () => {
          that.promiseDestructor(p.destructor, promise);
          if (wrappedReject != null) {
            that.clearProxy({
              id: wrappedReject,
              namespace: p.namespace
            });
          }
        },
        onClear: (...args) => {
          canceled = true;
          return that.onPromiseClear(resolve, reject)(...args);
        },
        onMerge: (...args) => {
          canceled = true;
          return that.onPromiseMerge(resolve, reject)(...args);
        },
        onMutedCall: link => {
          const handlers = Array.toArray(opts?.onMutedResolve);
          if (handlers.length > 0) {
            handlers.forEach(handler => {
              handler.call(ctx, wrappedResolve, wrappedReject);
            });
          } else {
            reject({
              ...p,
              link,
              reason: 'muting',
              type: 'clearAsync'
            });
          }
        }
      });
      if (!canceled) {
        if (Object.isFunction(promise)) {
          promise = promise();
        }
        wrappedReject = that.proxy(err => {
          if (canceled || p.namespace == null) {
            return;
          }
          const cache = that.cache[p.namespace],
            links = p.group != null ? cache.groups[p.group]?.links : cache.root.links;
          const task = links?.get(wrappedResolve),
            handlers = links?.get(wrappedResolve)?.onComplete;
          if (task != null && handlers != null) {
            if (task.muted) {
              return;
            }
            const execTask = () => {
              reject(err);
              handlers.forEach(handler => {
                handler[1].call(ctx, err);
              });
            };
            if (task.paused) {
              task.queue.push(execTask);
              return;
            }
            execTask();
          } else {
            reject(err);
          }
        }, {
          namespace: p.namespace,
          group: p.group
        });
        promise.then(wrappedResolve, wrappedReject);
      }
    }
  }
  cancelPromise(task) {
    return this.clearPromise(Object.cast(task));
  }
  clearPromise(task) {
    const namespace = (0, _core.isAsyncOptions)(task) ? task.namespace : null;
    this.cancelTask(task, namespace ?? _const.PrimitiveNamespaces.promise);
    if (namespace == null) {
      Object.values(this.Namespaces).forEach(namespace => {
        if (Object.isNumber(namespace) && _core.isPromisifyNamespace.test(namespace)) {
          this.cancelTask(task, namespace);
        }
      });
    }
    return this;
  }
  mutePromise(task) {
    return this.markPromise('muted', Object.cast(task));
  }
  unmutePromise(task) {
    return this.markPromise('!muted', Object.cast(task));
  }
  suspendPromise(task) {
    return this.markPromise('paused', Object.cast(task));
  }
  unsuspendPromise(task) {
    return this.markPromise('!paused', Object.cast(task));
  }
  request(request, opts) {
    return this.promise(request, {
      ...opts,
      namespace: _const.PrimitiveNamespaces.request
    });
  }
  cancelRequest(task) {
    return this.clearRequest(Object.cast(task));
  }
  clearRequest(task) {
    return this.cancelTask(task, _const.PrimitiveNamespaces.request);
  }
  muteRequest(task) {
    return this.markTask('muted', task, _const.PrimitiveNamespaces.request);
  }
  unmuteRequest(task) {
    return this.markTask('!muted', task, _const.PrimitiveNamespaces.request);
  }
  suspendRequest(task) {
    return this.markTask('paused', task, _const.PrimitiveNamespaces.request);
  }
  unsuspendRequest(task) {
    return this.markTask('!paused', task, _const.PrimitiveNamespaces.request);
  }
  promiseDestructor(destructor, promise) {
    let fn;
    if (destructor != null) {
      fn = promise[destructor];
    } else {
      const p = promise;
      fn = p.abort ?? p.cancel;
    }
    if (Object.isFunction(fn)) {
      if ('catch' in promise && Object.isFunction(promise.catch)) {
        promise.catch(() => {});
      }
      fn.call(promise);
    }
  }
  onPromiseClear(resolve, reject) {
    const MAX_PROMISE_DEPTH = 25;
    return task => {
      const {
        replacedBy
      } = task;
      if (replacedBy != null && task.join === 'replace' && task.link.onClear.length < MAX_PROMISE_DEPTH) {
        replacedBy.onComplete.push([resolve, reject]);
        Array.toArray(task.link.onClear, reject).forEach(onClear => {
          replacedBy.onClear.push(onClear);
        });
      } else {
        reject(task);
      }
    };
  }
  onPromiseMerge(resolve, reject) {
    return task => task.onComplete.push([resolve, reject]);
  }
  markPromise(label, task) {
    const namespace = (0, _core.isAsyncOptions)(task) ? task.namespace : null;
    this.markTask(label, task, namespace ?? _const.PrimitiveNamespaces.promise);
    if (namespace == null) {
      Object.values(this.Namespaces).forEach(namespace => {
        if (Object.isNumber(namespace) && _core.isPromisifyNamespace.test(namespace)) {
          this.markTask(label, task, namespace);
        }
      });
    }
    return this;
  }
}
exports.default = Async;