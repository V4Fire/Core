"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _const = require("../../../core/promise/abortable/const");
Object.keys(_const).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _const[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _const[key];
    }
  });
});
var _interface = require("../../../core/promise/abortable/interface");
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
class AbortablePromise {
  static wrapReasonToIgnore(reason) {
    Object.defineSymbol(reason, _const.IGNORE, true);
    return reason;
  }
  static resolve(value, parent) {
    if (value instanceof AbortablePromise) {
      if (parent != null) {
        parent.catch(err => value.abort(err));
      }
      return value;
    }
    return new AbortablePromise(resolve => resolve(value), parent);
  }
  static resolveAndCall(value, parent) {
    return AbortablePromise.resolve(value, parent).then(obj => Object.isFunction(obj) ? obj() : obj);
  }
  static reject(reason, parent) {
    return new AbortablePromise((_, reject) => reject(reason), parent);
  }
  static all(values, parent) {
    return new AbortablePromise((resolve, reject, onAbort) => {
      const promises = [];
      for (const el of values) {
        promises.push(AbortablePromise.resolve(el, parent));
      }
      if (promises.length === 0) {
        resolve([]);
        return;
      }
      onAbort(reason => {
        for (let i = 0; i < promises.length; i++) {
          promises[i].abort(reason);
        }
      });
      const results = new Array(promises.length);
      let done = 0;
      for (let i = 0; i < promises.length; i++) {
        const onFulfilled = val => {
          done++;
          results[i] = val;
          if (done === promises.length) {
            resolve(results);
          }
        };
        promises[i].then(onFulfilled, reject);
      }
    }, parent);
  }
  static allSettled(values, parent) {
    return new AbortablePromise((resolve, _, onAbort) => {
      const promises = [];
      for (const el of values) {
        promises.push(AbortablePromise.resolve(el, parent));
      }
      if (promises.length === 0) {
        resolve([]);
        return;
      }
      onAbort(reason => {
        for (let i = 0; i < promises.length; i++) {
          promises[i].abort(reason);
        }
      });
      const results = new Array(promises.length);
      let done = 0;
      for (let i = 0; i < promises.length; i++) {
        const onFulfilled = value => {
          done++;
          results[i] = {
            status: 'fulfilled',
            value
          };
          if (done === promises.length) {
            resolve(results);
          }
        };
        const onRejected = reason => {
          done++;
          results[i] = {
            status: 'rejected',
            reason
          };
          if (done === promises.length) {
            resolve(results);
          }
        };
        promises[i].then(onFulfilled, onRejected);
      }
    }, parent);
  }
  static race(values, parent) {
    return new AbortablePromise((resolve, reject, onAbort) => {
      const promises = [];
      for (const el of values) {
        promises.push(AbortablePromise.resolve(el, parent));
      }
      if (promises.length === 0) {
        resolve();
        return;
      }
      onAbort(reason => {
        for (let i = 0; i < promises.length; i++) {
          promises[i].abort(reason);
        }
      });
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(resolve, reject);
      }
    }, parent);
  }
  static any(values, parent) {
    return new AbortablePromise((resolve, reject, onAbort) => {
      const promises = [];
      for (const el of values) {
        promises.push(AbortablePromise.resolve(el, parent));
      }
      if (promises.length === 0) {
        resolve();
        return;
      }
      onAbort(reason => {
        for (let i = 0; i < promises.length; i++) {
          promises[i].abort(reason);
        }
      });
      const errors = [];
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(resolve, onReject);
      }
      function onReject(err) {
        errors.push(err);
        if (errors.length === promises.length) {
          reject(new AggregateError(errors, 'No Promise in Promise.any was resolved'));
        }
      }
    }, parent);
  }
  get isPending() {
    return this.state === _interface.State.pending;
  }
  pendingChildren = 0;
  state = _interface.State.pending;
  aborted = false;
  constructor(executor, parent) {
    this.promise = new Promise((resolve, reject) => {
      const onRejected = err => {
        if (!this.isPending) {
          return;
        }
        this.value = err;
        this.state = _interface.State.rejected;
        reject(err);
      };
      const onResolved = val => {
        if (!this.isPending || this.value != null) {
          return;
        }
        this.value = val;
        if (Object.isPromiseLike(val)) {
          val.then(forceResolve, onRejected);
          return;
        }
        this.state = _interface.State.fulfilled;
        resolve(val);
      };
      const forceResolve = val => {
        this.value = undefined;
        onResolved(val);
      };
      this.onResolve = onResolved;
      this.onReject = onRejected;
      let setOnAbort;
      if (parent != null) {
        const abortParent = reason => {
          parent.abort(reason);
        };
        this.onAbort = abortParent;
        parent.catch(err => {
          this.abort(err);
        });
        setOnAbort = cb => {
          this.onAbort = r => {
            abortParent(r);
            cb.call(this, r);
          };
          if (this.aborted) {
            this.onAbort();
          }
        };
      } else {
        setOnAbort = cb => {
          this.onAbort = Object.assign(cb.bind(this), {
            cb
          });
          if (this.aborted) {
            this.onAbort();
          }
        };
      }
      const canInvokeExecutor = this.isPending && (parent == null || parent.state !== _interface.State.rejected || Object.get(parent.value, [_const.IGNORE]) === true);
      if (canInvokeExecutor) {
        this.call(executor, [onResolved, onRejected, setOnAbort], onRejected);
      }
    });
  }
  then(onFulfilled, onRejected, onAbort) {
    this.pendingChildren++;
    return new AbortablePromise((resolve, reject, abort) => {
      const fulfillWrapper = val => {
        this.call(onFulfilled ?? resolve, [val], reject, resolve);
      };
      const rejectWrapper = val => {
        this.call(onRejected ?? reject, [val], reject, resolve);
      };
      const that = this;
      abort(function abortHandler(reason) {
        if (Object.isFunction(onAbort)) {
          try {
            onAbort(reason);
          } catch {}
        }
        this.aborted = true;
        if (!that.abort(reason)) {
          rejectWrapper(reason);
        }
      });
      this.promise.then(fulfillWrapper, rejectWrapper);
    });
  }
  catch(onRejected) {
    return new AbortablePromise((resolve, reject, onAbort) => {
      const rejectWrapper = val => {
        this.call(onRejected ?? reject, [val], reject, resolve);
      };
      const that = this;
      onAbort(function abortHandler(reason) {
        this.aborted = true;
        if (!that.abort(reason)) {
          rejectWrapper(reason);
        }
      });
      this.promise.then(resolve, rejectWrapper);
    });
  }
  finally(cb) {
    return new AbortablePromise((resolve, reject, onAbort) => {
      const that = this;
      onAbort(function abortHandler(reason) {
        this.aborted = true;
        if (!that.abort(reason)) {
          reject(reason);
        }
      });
      this.promise.finally(() => cb?.()).then(resolve, reject);
    });
  }
  abort(reason) {
    if (!this.isPending || this.aborted || Object.get(reason, [_const.IGNORE]) === true) {
      return false;
    }
    if (this.pendingChildren > 0) {
      this.pendingChildren--;
    }
    if (this.pendingChildren === 0) {
      this.call(this.onAbort, [reason]);
      if (!this.aborted) {
        this.onReject(reason);
        this.aborted = true;
      }
      return true;
    }
    return false;
  }
  call(fn, args = [], onError, onValue) {
    const reject = onError ?? loopback,
      resolve = onValue ?? loopback;
    try {
      const v = fn?.(...args);
      if (Object.isPromiseLike(v)) {
        v.then(resolve, reject);
      } else {
        resolve(v);
      }
    } catch (err) {
      reject(err);
    }
    function loopback() {
      return undefined;
    }
  }
}
exports.default = AbortablePromise;