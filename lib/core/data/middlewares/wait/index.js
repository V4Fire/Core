"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  wait: true
};
exports.wait = wait;

var _interface = require("../../../../core/data/middlewares/attach-status/interface");

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
 * [[include:core/data/middlewares/wait/README.md]]
 * @packageDocumentation
 */

/**
 * Middleware: if the request has some parameter to wait,
 * then the middleware won't be resolved until this parameter isn't resolved.
 *
 * This middleware can be used as encoder: the value to wait will be taken from input data (`.wait`),
 * otherwise, it will be taken from `.meta.wait`.
 */
async function wait(...args) {
  let res, wait;
  const fst = args[0]; // Middleware mode

  if (args.length === 1) {
    wait = fst?.opts.meta['wait']; // Encoder mode
  } else if (Object.isDictionary(fst)) {
    res = fst;
    wait = fst['wait'];

    if (wait !== undefined) {
      delete fst['wait'];
    }
  }

  if (wait !== undefined) {
    await (Object.isFunction(wait) ? wait(...args) : wait);
  }

  return res;
}