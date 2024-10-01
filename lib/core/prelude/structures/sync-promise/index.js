"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _interface = require("../../../../core/prelude/structures/sync-promise/interface");
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
class SyncPromise {
  static resolve(value) {
    const Constr = Object.isTruly(this) ? this : SyncPromise;
    if (value instanceof Constr) {
      return value;
    }
    return new Constr(resolve => resolve(value));
  }
  static reject(reason) {
    const Constr = Object.isTruly(this) ? this : SyncPromise;
    return new Constr((_, reject) => reject(reason));
  }
  static all(values) {
    return new SyncPromise((resolve, reject) => {
      const promises = [];
      for (const el of values) {
        promises.push(SyncPromise.resolve(el));
      }
      if (promises.length === 0) {
        resolve([]);
        return;
      }
      const results = new Array(promises.length);
      let done = 0;
      promises.forEach((promise, i) => {
        const onFulfilled = val => {
          done++;
          results[i] = val;
          if (done === promises.length) {
            resolve(results);
          }
        };
        promise.then(onFulfilled, reject);
      });
    });
  }
  static allSettled(values) {
    return new SyncPromise(resolve => {
      const promises = [];
      for (const el of values) {
        promises.push(SyncPromise.resolve(el));
      }
      if (promises.length === 0) {
        resolve([]);
        return;
      }
      const results = new Array(promises.length);
      let done = 0;
      promises.forEach((promise, i) => {
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
        promise.then(onFulfilled, onRejected);
      });
    });
  }
  static race(values) {
    return new SyncPromise((resolve, reject) => {
      const promises = [];
      for (const el of values) {
        promises.push(SyncPromise.resolve(el));
      }
      if (promises.length === 0) {
        resolve();
        return;
      }
      promises.forEach(promise => {
        promise.then(resolve, reject);
      });
    });
  }
  static any(values) {
    return new SyncPromise((resolve, reject) => {
      const promises = [];
      for (const el of values) {
        promises.push(SyncPromise.resolve(el));
      }
      if (promises.length === 0) {
        resolve();
        return;
      }
      const errors = [];
      promises.forEach(promise => {
        promise.then(resolve, onReject);
      });
      function onReject(err) {
        errors.push(err);
        if (errors.length === promises.length) {
          reject(new AggregateError(errors, 'No Promise in Promise.any was resolved'));
        }
      }
    });
  }
  get isPending() {
    return this.state === _interface.State.pending;
  }
  state = _interface.State.pending;
  fulfillHandlers = [];
  rejectHandlers = [];
  constructor(executor) {
    const clear = () => {
      this.fulfillHandlers = [];
      this.rejectHandlers = [];
    };
    const reject = err => {
      if (!this.isPending) {
        return;
      }
      this.value = err;
      this.state = _interface.State.rejected;
      this.rejectHandlers.forEach(handler => {
        handler(err);
      });
      setImmediate(() => {
        if (this.rejectHandlers.length === 0) {
          void Promise.reject(err);
        }
        clear();
      });
    };
    const resolve = val => {
      if (!this.isPending || this.value != null) {
        return;
      }
      this.value = val;
      if (Object.isPromiseLike(val)) {
        val.then(forceResolve, reject);
        return;
      }
      this.state = _interface.State.fulfilled;
      this.fulfillHandlers.forEach(handler => {
        handler(val);
      });
      clear();
    };
    const forceResolve = val => {
      this.value = undefined;
      resolve(val);
    };
    this.call(executor, [resolve, reject], reject);
  }
  unwrap() {
    if (this.state !== _interface.State.fulfilled) {
      if (this.isPending) {
        throw new Error("Can't unwrap a pending promise");
      }
      if (this.rejectHandlers.length === 0) {
        this.rejectHandlers.push(() => {});
      }
      throw this.value;
    }
    return this.value;
  }
  then(onFulfilled, onRejected) {
    return new SyncPromise((resolve, reject) => {
      const fulfillWrapper = val => {
        this.call(onFulfilled ?? resolve, [val], reject, resolve);
      };
      const rejectWrapper = err => {
        this.call(onRejected ?? reject, [err], reject, resolve);
      };
      this.fulfillHandlers.push(fulfillWrapper);
      this.rejectHandlers.push(rejectWrapper);
      if (!this.isPending) {
        (this.state === _interface.State.fulfilled ? fulfillWrapper : rejectWrapper)(this.value);
      }
    });
  }
  catch(onRejected) {
    return new SyncPromise((resolve, reject) => {
      const rejectWrapper = err => {
        this.call(onRejected ?? reject, [err], reject, resolve);
      };
      this.fulfillHandlers.push(resolve);
      this.rejectHandlers.push(rejectWrapper);
      if (!this.isPending) {
        (this.state === _interface.State.fulfilled ? resolve : rejectWrapper)(this.value);
      }
    });
  }
  finally(cb) {
    return new SyncPromise((resolve, reject) => {
      const fulfillWrapper = () => {
        try {
          let res = cb?.();
          if (Object.isPromiseLike(res)) {
            res = res.then(() => this.value);
          } else {
            res = this.value;
          }
          resolve(res);
        } catch (err) {
          reject(err);
        }
      };
      const rejectWrapper = () => {
        try {
          let res = cb?.();
          if (Object.isPromiseLike(res)) {
            res = res.then(() => this.value);
            resolve(res);
          } else {
            reject(this.value);
          }
        } catch (err) {
          reject(err);
        }
      };
      this.fulfillHandlers.push(fulfillWrapper);
      this.rejectHandlers.push(rejectWrapper);
      if (!this.isPending) {
        (this.state === _interface.State.fulfilled ? fulfillWrapper : rejectWrapper)();
      }
    });
  }
  call(fn, args = [], onError, onValue) {
    const reject = onError ?? loopback,
      resolve = onValue ?? loopback;
    try {
      const res = fn?.(...args);
      if (Object.isPromiseLike(res)) {
        res.then(resolve, reject);
      } else {
        resolve(res);
      }
    } catch (err) {
      reject(err);
    }
    function loopback() {
      return undefined;
    }
  }
}
exports.default = SyncPromise;