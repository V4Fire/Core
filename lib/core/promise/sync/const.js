"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.weakMemoizeCache = exports.longMemoizeCache = void 0;
const weakMemoizeCache = new WeakMap(),
  longMemoizeCache = new Map();
exports.longMemoizeCache = longMemoizeCache;
exports.weakMemoizeCache = weakMemoizeCache;