"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _implementation = require("../../../../core/functools/implementation");
var _default = ['get', 'set', 'remove', 'keys'].reduce((engine, method) => {
  engine[method] = (0, _implementation.unimplement)({
    name: method
  }, () => undefined);
  return engine;
}, {});
exports.default = _default;