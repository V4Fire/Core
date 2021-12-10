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

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Class is similar to the native promise class but works synchronously
 */
class SyncPromise {
  /**
   * Returns a SyncPromise object that is resolved with a given value.
   *
   * If the value is a promise, that promise is returned; if the value is a thenable (i.e., has a "then" method),
   * the returned promise will "follow" that thenable, adopting its eventual state; otherwise,
   * the returned promise will be fulfilled with the value.
   *
   * This function flattens nested layers of promise-like objects
   * (e.g., a promise that resolves to a promise that resolves to something) into a single layer.
   *
   * @param value
   */

  /**
   * Returns a new resolved SyncPromise object with an undefined value
   */
  static resolve(value) {
    const Constr = Object.isTruly(this) ? this : SyncPromise;

    if (value instanceof Constr) {
      return value;
    }

    return new Constr(resolve => resolve(value));
  }
  /**
   * Returns a SyncPromise object that is rejected with a given reason
   * @param [reason]
   */


  static reject(reason) {
    const Constr = Object.isTruly(this) ? this : SyncPromise;
    return new Constr((_, reject) => reject(reason));
  }
  /**
   * Takes an iterable of promises and returns a single SyncPromise that resolves to an array of the results
   * of the input promises. This returned promise will resolve when all of the input's promises have been resolved or
   * if the input iterable contains no promises. It rejects immediately upon any of the input promises rejecting or
   * non-promises throwing an error and will reject with this first rejection message/error.
   *
   * @param values
   */


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
    });
  }
  /**
   * Returns a promise that resolves after all of the given promises have either been fulfilled or rejected,
   * with an array of objects describing each promise's outcome.
   *
   * It is typically used when you have multiple asynchronous tasks that are not dependent on one another to
   * complete successfully, or you'd always like to know the result of each promise.
   *
   * In comparison, the SyncPromise returned by `SyncPromise.all()` may be more appropriate
   * if the tasks are dependent on each other / if you'd like to reject upon any of them reject immediately.
   *
   * @param values
   */


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
    });
  }
  /**
   * Returns a promise that fulfills or rejects as soon as one of the promises in an iterable fulfills or rejects,
   * with the value or reason from that promise
   *
   * @param values
   */


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

      for (let i = 0; i < promises.length; i++) {
        promises[i].then(resolve, reject);
      }
    });
  }
  /**
   * Takes an iterable of SyncPromise objects and, as soon as one of the promises in the iterable fulfills,
   * returns a single promise that resolves with the value from that promise. If no promises in the iterable fulfill
   * (if all of the given promises are rejected), then the returned promise is rejected with an AggregateError,
   * a new subclass of Error that groups together individual errors.
   *
   * @param values
   */


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

      for (let i = 0; i < promises.length; i++) {
        promises[i].then(resolve, onReject);
      }

      function onReject(err) {
        errors.push(err);

        if (errors.length === promises.length) {
          reject(new AggregateError(errors, 'No Promise in Promise.any was resolved'));
        }
      }
    });
  }
  /** @override */


  /**
   * True if the current promise is pending
   */
  get isPending() {
    return this.state === _interface.State.pending;
  }
  /**
   * Actual promise state
   */


  state = _interface.State.pending;
  /**
   * Resolved promise value
   */

  /**
   * List of handlers to handle the promise fulfilling
   */
  fulfillHandlers = [];
  /**
   * List of handlers to handle the promise rejection
   */

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

      for (let o = this.rejectHandlers, i = 0; i < o.length; i++) {
        o[i](err);
      }

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
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        val.then(forceResolve, reject);
        return;
      }

      this.state = _interface.State.fulfilled;

      for (let o = this.fulfillHandlers, i = 0; i < o.length; i++) {
        o[i](val);
      }

      clear();
    };

    const forceResolve = val => {
      this.value = undefined;
      resolve(val);
    };

    this.call(executor, [resolve, reject], reject);
  }
  /**
   * Returns the promise' value if it is fulfilled, otherwise throws an exception
   */


  unwrap() {
    if (this.state !== _interface.State.fulfilled) {
      if (this.isPending) {
        throw new Error("Can't unwrap a pending promise");
      }

      if (this.rejectHandlers.length === 0) {
        this.rejectHandlers.push(() => {// Loopback
        });
      }

      throw this.value;
    }

    return this.value;
  }
  /**
   * Attaches handlers for the promise fulfilled and/or rejected states.
   * The method returns a new promise that will be resolved with a value that returns from the passed handlers.
   *
   * @param [onFulfilled]
   * @param [onRejected]
   */


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
  /**
   * Attaches a handler for the promise' rejected state.
   * The method returns a new promise that will be resolved with a value that returns from the passed handler.
   *
   * @param [onRejected]
   */


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
  /**
   * Attaches a common callback for the promise fulfilled and rejected states.
   * The method returns a new promise with the state and value from the current.
   * A value from the passed callback will be ignored unless it equals a rejected promise or exception.
   *
   * @param [cb]
   */


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
  /**
   * Executes a function with the specified parameters
   *
   * @param fn
   * @param args - arguments for the function
   * @param [onError] - error handler
   * @param [onValue] - success handler
   */


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