"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testCache = exports.isGlobal = exports.escapeRgxp = void 0;
const isGlobal = /g/,
  escapeRgxp = /([\\/'*+?|()[\]{}.^$-])/g;
exports.escapeRgxp = escapeRgxp;
exports.isGlobal = isGlobal;
const testCache = Object.createDict();
exports.testCache = testCache;