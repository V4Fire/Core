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
const onEverythingReady = (0, _functools.deprecate)({
  renamedTo: 'createsAsyncSemaphore'
}, function onEverythingReady(cb, ...flags) {
  return createsAsyncSemaphore(cb, ...flags);
});
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