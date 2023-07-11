"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createsAsyncSemaphore = createsAsyncSemaphore;
exports.resolveAfterEvents = resolveAfterEvents;
var _sync = _interopRequireDefault(require("../../core/promise/sync"));
var _async = _interopRequireDefault(require("../../core/async"));
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
  let resolve;
  const promise = new _sync.default(r => {
    resolve = r;
  });
  promise.catch(stderr);
  return flag => {
    if (!promise.isPending || flagsStatus[flag] != null) {
      return promise;
    }
    flagsStatus[flag] = true;
    for (let i = 0; i < flags.length; i++) {
      if (flagsStatus[flags[i]] == null) {
        return promise;
      }
    }
    resolve(cb());
    return promise;
  };
}