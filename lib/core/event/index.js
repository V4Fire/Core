"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSyncPromise = exports.afterEvents = void 0;
exports.createsAsyncSemaphore = createsAsyncSemaphore;
exports.onEverythingReady = void 0;
exports.resolveAfterEvents = resolveAfterEvents;

var _sync = _interopRequireDefault(require("../../core/promise/sync"));

var _async = _interopRequireDefault(require("../../core/async"));

var _functools = require("../../core/functools");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/event/README.md]]
 * @packageDocumentation
 */

/**
 * Returns a promise that will be resolved after emitting of all events from the specified emitter
 *
 * @param emitter
 * @param events - events to listen
 *
 * @example
 * ```js
 * // The promise will be resolved after two window events
 * resolveAfterEvents(window, 'resize', 'scroll').then(() => {
 *   console.log('Boom!');
 * });
 * ```
 */
function resolveAfterEvents(emitter, ...events) {
  const $a = new _async.default();
  return new _sync.default(resolve => {
    const res = {};

    for (let i = 0; i < events.length; i++) {
      const ev = events[i];
      res[ev] = false;
      $a.once(emitter, ev, () => {
        res[ev] = true;

        if (events.every(e => res[e])) {
          resolve();
        }
      });
    }
  });
}
/**
 * Wraps a callback into a new function that never calls the target until all specified flags are resolved.
 * The function returns a new function that takes a string flag and resolves it.
 * After all, flags are resolved, the last function invokes the target function.
 * If you try to invoke the function after the first time resolving, ii won't be executed.
 *
 * @param cb - callback function that is invoked after resolving all flags
 * @param flags - flags to resolve
 *
 * @example
 * ```js
 * const semaphore = createsAsyncSemaphore(() => {
 *   console.log('Boom!');
 * }, 'foo', 'bar');
 *
 * semaphore('foo');
 * semaphore('bar'); // 'Boom!'
 *
 * // Function already resolved, the target function isn't executed
 * semaphore();
 * ```
 */


function createsAsyncSemaphore(cb, ...flags) {
  const flagsStatus = Object.createDict();
  let ready = false;
  return flag => {
    if (ready || flagsStatus[flag] != null) {
      return;
    }

    flagsStatus[flag] = true;

    for (let i = 0; i < flags.length; i++) {
      if (flagsStatus[flags[i]] == null) {
        return;
      }
    }

    ready = true;
    const res = cb();

    if (Object.isPromise(res)) {
      res.catch(stderr);
    }

    return res;
  };
}
/**
 * @deprecated
 * @see [[createsAsyncSemaphore]]
 */


const onEverythingReady = (0, _functools.deprecate)({
  renamedTo: 'createsAsyncSemaphore'
}, function onEverythingReady(cb, ...flags) {
  return createsAsyncSemaphore(cb, ...flags);
});
/**
 * @deprecated
 * @see [[resolveAfterEvents]]
 */

exports.onEverythingReady = onEverythingReady;
const afterEvents = (0, _functools.deprecate)({
  alternative: 'resolveAfterEvents'
}, function afterEvents(emitter, cb, ...events) {
  const promise = resolveAfterEvents(emitter, ...Array.concat([], Object.isString(cb) ? cb : null, events));

  if (Object.isFunction(cb)) {
    promise.then(cb, stderr);
  }

  return promise;
});
/**
 * Creates a synchronous promise wrapper for the specified value
 *
 * @deprecated
 * @see [[SyncPromise]]
 * @param resolveValue
 * @param rejectValue
 */

exports.afterEvents = afterEvents;
const createSyncPromise = (0, _functools.deprecate)({
  alternative: {
    name: 'SyncPromise',
    source: 'core/promise/sync'
  }
}, function createSyncPromise(resolveValue, rejectValue) {
  if (rejectValue !== undefined) {
    return _sync.default.reject(rejectValue);
  }

  return _sync.default.resolve(resolveValue);
});
exports.createSyncPromise = createSyncPromise;