"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extend;
function extend(factory, records) {
  return Object.mixin(false, factory, records);
}