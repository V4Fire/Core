"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _sync = _interopRequireDefault(require("../../../../core/promise/sync"));
var _base = _interopRequireWildcard(require("../../../../core/async/modules/base"));
Object.keys(_base).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _base[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _base[key];
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
class Async extends _base.default {
  worker(worker, opts) {
    const {
      workerCache
    } = this;
    if (!workerCache.has(worker)) {
      workerCache.set(worker, true);
      worker[_base.asyncCounter] = Number(worker[_base.asyncCounter] ?? 0) + 1;
    }
    const clearFn = this.workerDestructor.bind(this, opts?.destructor);
    return this.registerTask({
      ...opts,
      name: this.namespaces.worker,
      obj: worker,
      clearFn,
      periodic: opts?.single === false,
      onMerge(...args) {
        const handlers = Array.concat([], opts?.onMerge);
        for (let i = 0; i < handlers.length; i++) {
          handlers[i].apply(this, args);
        }
        clearFn(worker);
      }
    }) ?? worker;
  }
  terminateWorker(task) {
    return this.clearWorker(Object.cast(task));
  }
  clearWorker(task) {
    return this.cancelTask(task, (0, _base.isAsyncOptions)(task) && task.name || this.namespaces.worker);
  }
  proxy(fn, opts) {
    return this.registerTask({
      ...opts,
      name: opts?.name ?? this.namespaces.proxy,
      obj: fn,
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
    return this.cancelTask(task, (0, _base.isAsyncOptions)(task) && task.name || this.namespaces.proxy);
  }
  muteProxy(task) {
    return this.markTask('muted', task, (0, _base.isAsyncOptions)(task) && task.name || this.namespaces.proxy);
  }
  unmuteProxy(task) {
    return this.markTask('!muted', task, (0, _base.isAsyncOptions)(task) && task.name || this.namespaces.proxy);
  }
  suspendProxy(task) {
    return this.markTask('paused', task, (0, _base.isAsyncOptions)(task) && task.name || this.namespaces.proxy);
  }
  unsuspendProxy(task) {
    return this.markTask('!paused', task, (0, _base.isAsyncOptions)(task) && task.name || this.namespaces.proxy);
  }
  request(request, opts) {
    return this.promise(request, {
      ...opts,
      name: this.namespaces.request
    });
  }
  cancelRequest(task) {
    return this.clearRequest(Object.cast(task));
  }
  clearRequest(task) {
    return this.cancelTask(task, this.namespaces.request);
  }
  muteRequest(task) {
    return this.markTask('muted', task, this.namespaces.request);
  }
  unmuteRequest(task) {
    return this.markTask('!muted', task, this.namespaces.request);
  }
  suspendRequest(task) {
    return this.markTask('paused', task, this.namespaces.request);
  }
  unsuspendRequest(task) {
    return this.markTask('!paused', task, this.namespaces.request);
  }
  iterable(iterable, opts) {
    const baseIterator = this.getBaseIterator(iterable);
    if (baseIterator == null) {
      return Object.cast({
        *[Symbol.asyncIterator]() {
          return undefined;
        }
      });
    }
    let globalError,
      doneDelay = 0;
    const newIterable = {
      [Symbol.asyncIterator]: () => ({
        [Symbol.asyncIterator]() {
          return this;
        },
        next: () => {
          if (globalError != null) {
            return Promise.reject(globalError);
          }
          const promise = this.promise(Promise.resolve(baseIterator.next()), {
            ...opts,
            name: this.namespaces.iterable,
            onMutedResolve: (resolve, reject) => {
              if (doneDelay > 0) {
                setTimeout(() => {
                  resolve({
                    value: undefined,
                    done: true
                  });
                }, doneDelay);
                return;
              }
              Promise.resolve(baseIterator.next()).then(res => {
                if (res.done) {
                  if (doneDelay === 0) {
                    doneDelay = 15;
                  } else if (doneDelay < 200) {
                    doneDelay *= 2;
                  }
                }
                resolve(res);
              }, reject);
            }
          });
          promise.catch(err => {
            if (Object.isDictionary(err) && err.type === 'clearAsync') {
              globalError = err;
            }
          });
          this.idsMap.set(newIterable, this.idsMap.get(promise) ?? promise);
          return promise;
        }
      })
    };
    if (Object.isIterable(iterable[Symbol.iterator])) {
      newIterable[Symbol.iterator] = iterable[Symbol.iterator];
    }
    return newIterable;
  }
  cancelIterable(task) {
    return this.clearIterable(Object.cast(task));
  }
  clearIterable(task) {
    return this.cancelTask(task, this.namespaces.iterable);
  }
  muteIterable(task) {
    return this.markTask('muted', task, this.namespaces.iterable);
  }
  unmuteIterable(task) {
    return this.markTask('!muted', task, this.namespaces.iterable);
  }
  suspendIterable(task) {
    return this.markTask('paused', task, this.namespaces.iterable);
  }
  unsuspendIterable(task) {
    return this.markTask('!paused', task, this.namespaces.iterable);
  }
  promise(promise, opts) {
    if (!Object.isTruly(promise)) {
      return _sync.default.resolve();
    }
    const that = this,
      {
        ctx
      } = this;
    const p = {
      name: this.namespaces.promise,
      ...opts
    };
    let wrappedResolve;
    const wrappedPromise = new _sync.default((resolve, reject) => {
      let canceled = false,
        proxyReject;
      wrappedResolve = this.proxy(resolve, {
        ...p,
        clearFn: () => {
          this.promiseDestructor(p.destructor, promise);
          if (proxyReject != null) {
            this.clearProxy({
              id: proxyReject,
              name: p.name
            });
          }
        },
        onClear: (...args) => {
          canceled = true;
          return this.onPromiseClear(resolve, reject)(...args);
        },
        onMerge: (...args) => {
          canceled = true;
          return this.onPromiseMerge(resolve, reject)(...args);
        },
        onMutedCall: link => {
          const handlers = Array.concat([], opts?.onMutedResolve);
          if (handlers.length > 0) {
            for (let i = 0; i < handlers.length; i++) {
              handlers[i].call(ctx, wrappedResolve, proxyReject);
            }
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
        proxyReject = this.proxy(err => {
          if (canceled || p.name == null) {
            return;
          }
          const cache = that.cache[p.name],
            links = p.group != null ? cache?.groups[p.group]?.links : cache?.root.links;
          const task = links?.get(wrappedResolve),
            handlers = links?.get(wrappedResolve)?.onComplete;
          if (task != null && handlers != null) {
            if (task.muted === true) {
              return;
            }
            const exec = () => {
              reject(err);
              for (let i = 0; i < handlers.length; i++) {
                handlers[i][1].call(ctx, err);
              }
            };
            if (task.paused === true) {
              task.queue.push(exec);
              return;
            }
            exec();
          } else {
            reject(err);
          }
        }, Object.select(p, ['name', 'group']));
        return promise.then(wrappedResolve, proxyReject);
      }
    });
    this.idsMap.set(wrappedPromise, wrappedResolve);
    return wrappedPromise;
  }
  cancelPromise(task) {
    return this.clearPromise(Object.cast(task));
  }
  clearPromise(task) {
    const nms = this.namespaces,
      nm = (0, _base.isAsyncOptions)(task) ? task.name : null;
    this.cancelTask(task, nm ?? nms.promise);
    if (nm == null) {
      for (let keys = Object.keys(nms), i = 0; i < keys.length; i++) {
        const key = keys[i],
          nm = nms[key];
        if (nm != null && _base.isPromisifyNamespace.test(key)) {
          this.cancelTask(task, nm);
        }
      }
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
  workerDestructor(destructor, worker) {
    const {
      workerCache
    } = this;
    if (workerCache.has(worker)) {
      workerCache.delete(worker);
      if (--worker[_base.asyncCounter] <= 0) {
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
    return obj => {
      const {
        replacedBy
      } = obj;
      if (replacedBy != null && obj.join === 'replace' && obj.link.onClear.length < MAX_PROMISE_DEPTH) {
        replacedBy.onComplete.push([resolve, reject]);
        const onClear = Array.concat([], obj.link.onClear, reject);
        for (let i = 0; i < onClear.length; i++) {
          replacedBy.onClear.push(onClear[i]);
        }
      } else {
        reject(obj);
      }
    };
  }
  onPromiseMerge(resolve, reject) {
    return obj => obj.onComplete.push([resolve, reject]);
  }
  markPromise(label, task) {
    const nms = this.namespaces,
      nm = (0, _base.isAsyncOptions)(task) ? task.name : null;
    this.markTask(label, task, nm ?? nms.promise);
    if (nm == null) {
      for (let keys = Object.keys(nms), i = 0; i < keys.length; i++) {
        const key = keys[i],
          nm = nms[key];
        if (nm != null && _base.isPromisifyNamespace.test(key)) {
          this.markTask(label, task, nm);
        }
      }
    }
    return this;
  }
  getBaseIterator(iterable) {
    if (Object.isFunction(iterable[Symbol.asyncIterator])) {
      return iterable[Symbol.asyncIterator]();
    }
    if (Object.isFunction(iterable[Symbol.iterator])) {
      return iterable[Symbol.iterator]();
    }
  }
}
exports.default = Async;