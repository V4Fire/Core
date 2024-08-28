"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _promise = _interopRequireDefault(require("../../../core/async/proxy/promise"));
var _const = require("../../../core/async/const");
class Async extends _promise.default {
  iterable(iterable, opts) {
    const iter = this.getBaseIterator(iterable);
    if (iter == null) {
      return Object.cast({
        *[Symbol.asyncIterator]() {
          return undefined;
        }
      });
    }
    let doneDelay = 0;
    let globalError;
    const newIterable = {
      [Symbol.asyncIterator]: () => ({
        [Symbol.asyncIterator]() {
          return this;
        },
        next: () => {
          if (globalError != null) {
            return Promise.reject(globalError);
          }
          const promise = this.promise(Promise.resolve(iter.next()), {
            ...opts,
            namespace: _const.PrimitiveNamespaces.iterable,
            onMutedResolve: (resolve, reject) => {
              if (doneDelay > 0) {
                setTimeout(resolve, doneDelay, {
                  value: undefined,
                  done: true
                });
                return;
              }
              Promise.resolve(iter.next()).then(res => {
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
          this.ids.set(newIterable, this.ids.get(promise) ?? promise);
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
    return this.cancelTask(task, _const.PrimitiveNamespaces.iterable);
  }
  muteIterable(task) {
    return this.markTask('muted', task, _const.PrimitiveNamespaces.iterable);
  }
  unmuteIterable(task) {
    return this.markTask('!muted', task, _const.PrimitiveNamespaces.iterable);
  }
  suspendIterable(task) {
    return this.markTask('paused', task, _const.PrimitiveNamespaces.iterable);
  }
  unsuspendIterable(task) {
    return this.markTask('!paused', task, _const.PrimitiveNamespaces.iterable);
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