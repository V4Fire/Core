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
async function wait(...args) {
  let res, wait;
  const fst = args[0];
  if (args.length === 1) {
    wait = fst?.opts.meta['wait'];
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