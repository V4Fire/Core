"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defReadonlyProp = exports.defProp = void 0;
const defProp = Object.freeze({
  configurable: true,
  enumerable: true,
  writable: true,
  value: undefined
});
exports.defProp = defProp;
const defReadonlyProp = Object.freeze({
  configurable: true,
  enumerable: true,
  writable: false,
  value: undefined
});
exports.defReadonlyProp = defReadonlyProp;