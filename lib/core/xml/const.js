"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeRgxp = void 0;
const normalizeRgxp = /"|(\s+)|[{}|\\^~[\]`"<>#%]/g;
exports.normalizeRgxp = normalizeRgxp;