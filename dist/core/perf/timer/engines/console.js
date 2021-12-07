"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.consoleEngine = void 0;

var _env = require("../../../../core/prelude/env");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const consoleEngine = {
  /** @see [[PerfTimerEngine.sendDelta]] */
  sendDelta(name, duration, additional) {
    const args = [`${name} took ${duration} ms`];

    if (additional != null) {
      args.push(additional);
    }

    console.warn(...args);
  },

  /** @see [[PerfTimerEngine.getTimestampFromTimeOrigin]] */
  getTimestampFromTimeOrigin() {
    let perf = globalThis.performance;

    if (_env.IS_NODE) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-nodejs-modules
      perf = require('perf_hooks').performance;
    }

    return perf.now();
  }

};
exports.consoleEngine = consoleEngine;