"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorsToIgnore = void 0;
const errorsToIgnore = Object.createDict({
  clearAsync: true,
  abort: true
});
exports.errorsToIgnore = errorsToIgnore;