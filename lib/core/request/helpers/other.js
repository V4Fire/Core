"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.merge = merge;
function merge(...args) {
  return Object.mixin({
    deep: true,
    concatArrays: (a, b) => a.union(b),
    extendFilter: el => Array.isArray(el) || Object.isDictionary(el)
  }, undefined, ...args);
}