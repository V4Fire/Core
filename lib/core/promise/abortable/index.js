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

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/promise/abortable/README.md]]
 * @packageDocumentation
 */

/**
 * Class wraps promise-like objects and adds to them some extra functionality,
 * such as possibility of cancellation, etc.
 *
 * @typeparam T - promise resolved value
 */
class AbortablePromise {
  /**
   * The method wraps the specified abort reason to ignore with tied promises,
   * i.e., this reason won't reject all child promises
   *
   * @param reason
   */
  static wrapReasonToIgnore(reason) {
    reason[_const.IGNORE] = true;
    return reason;
  }
  /**
   * Returns an AbortablePromise object that is resolved with a given value.
   *
   * If the value is a promise, that promise is returned; if the value is a thenable (i.e., has a "then" method),
   * the returned promise will "follow" that thenable, adopting its eventual state; otherwise,
   * the returned promise will be fulfilled with the value.
   *
   * This function flattens nested layers of promise-like objects
   * (e.g., a promise that resolves to a promise that resolves to something) into a single layer.
   *
   * @param value
   * @param [parent] - parent promise
   */


  static resolve(value, parent) {
    if (value instanceof AbortablePromise) {
      if (parent != null) {
        parent.catch(err => value.abort(err));
      }

      return value;
    }

    return new AbortablePromise(resolve => resolve(value), parent);
  }
  /**
   * Returns an AbortablePromise object that is resolved with a given value.
   * If the resolved value is a function, it will be invoked.
   * The result of the invoking will be provided as a value of the promise.
   *
   * If the value is a promise, that promise is returned; if the value is a thenable (i.e., has a "then" method),
   * the returned promise will "follow" that thenable, adopting its eventual state; otherwise,
   * the returned promise will be fulfilled with the value.
   *
   * This function flattens nested layers of promise-like objects
   * (e.g., a promise that resolves to a promise that resolves to something) into a single layer.
   *
   * @param value
   * @param [parent] - parent promise
   */


  static resolveAndCall(value, parent) {
    return AbortablePromise.resolve(value, parent).then(obj => Object.isFunction(obj) ? obj() : obj);
  }
  /**
   * Returns an AbortablePromise object that is rejected with a given reason
   *
   * @param [reason]
   * @param [parent] - parent promise
   */


  static reject(reason, parent) {
    return new AbortablePromise((_, reject) => reject(reason), parent);
  }
  /**
   * Takes an iterable of promises and returns a single AbortablePromise that resolves to an array of the results
   * of the input promises. This returned promise will resolve when all of the input's promises have been resolved or
   * if the input iterable contains no promises. It rejects immediately upon any of the input promises rejecting or
   * non-promises throwing an error and will reject with this first rejection message/error.
   *
   * @param values
   * @param [parent] - parent promise
   */
  // @ts-ignore (invalid implementation)


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
  /**
   * Returns a promise that resolves after all of the given promises have either been fulfilled or rejected,
   * with an array of objects describing each promise's outcome.
   *
   * It is typically used when you have multiple asynchronous tasks that are not dependent on one another to
   * complete successfully, or you'd always like to know the result of each promise.
   *
   * In comparison, the AbortablePromise returned by `AbortablePromise.all()` may be more appropriate
   * if the tasks are dependent on each other / if you'd like to reject upon any of them reject immediately.
   *
   * @param values
   * @param [parent] - parent promise
   */
  // @ts-ignore (invalid implementation)


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
  /**
   * Creates an abortable promise that is resolved or rejected when any of the provided promises are resolved or
   * rejected
   *
   * @param values
   * @param [parent] - parent promise
   */


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
  /**
   * Creates a promise that is resolved when any of the provided promises are resolved or
   * rejected if the provided all promises are rejected
   *
   * @param values
   * @param [parent] - parent promise
   */


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
  /** @override */


  /**
   * True if the current promise is pending
   */
  get isPending() {
    return this.state === _interface.State.pending;
  }
  /**
   * Number of pending child promises
   */


  pendingChildren = 0;
  /**
   * Actual promise state
   */

  state = _interface.State.pending;
  /**
   * Resolved promise value
   */

  /**
   * If true, then the promise was aborted
   */
  aborted = false;
  /**
   * Internal native promise instance
   */

  /**
   * @param executor - executor function
   * @param [parent] - parent promise
   */
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
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
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
        };
      } else {
        setOnAbort = cb => {
          this.onAbort = Object.assign(cb.bind(this), {
            cb
          });
        };
      }

      const canInvokeExecutor = this.isPending && (parent == null || parent.state !== _interface.State.rejected || Object.get(parent.value, [_const.IGNORE]) === true);

      if (canInvokeExecutor) {
        this.call(executor, [onResolved, onRejected, setOnAbort], onRejected);
      }
    });
  }
  /**
   * Attaches handlers for the promise fulfilled and/or rejected states.
   * The method returns a new promise that will be resolved with a value that returns from the passed handlers.
   *
   * @param [onFulfilled]
   * @param [onRejected]
   * @param [onAbort]
   */


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
  /**
   * Attaches a handler for the promise' rejected state.
   * The method returns a new promise that will be resolved with a value that returns from the passed handler.
   *
   * @param [onRejected]
   */


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
  /**
   * Attaches a common callback for the promise fulfilled and rejected states.
   * The method returns a new promise with the state and value from the current.
   * A value from the passed callback will be ignored unless it equals a rejected promise or exception.
   *
   * @param [cb]
   */


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
  /**
   * Aborts the current promise (the promise will be rejected)
   * @param [reason] - abort reason
   */


  abort(reason) {
    if (!this.isPending || this.aborted || Object.get(reason, [_const.IGNORE]) === true) {
      return false;
    }

    if (this.pendingChildren > 0) {
      this.pendingChildren--;
    }

    if (this.pendingChildren === 0) {
      this.call(this.onAbort, [reason]); // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition

      if (!this.aborted) {
        this.onReject(reason);
        this.aborted = true;
      }

      return true;
    }

    return false;
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