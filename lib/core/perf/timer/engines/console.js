"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.consoleEngine = void 0;
var _env = require("../../../../core/prelude/env");
const consoleEngine = {
  sendDelta(name, duration, additional) {
    const args = [`${name} took ${duration} ms`];
    if (additional != null) {
      args.push(additional);
    }
    console.warn(...args);
  },
  getTimestampFromTimeOrigin() {
    let perf = globalThis.performance;
    if (_env.IS_NODE) {
      perf = require('perf_hooks').performance;
    }
    return perf.now();
  }
};
exports.consoleEngine = consoleEngine;