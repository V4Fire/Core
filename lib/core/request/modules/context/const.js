"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveURLRgxp = exports.queryTplRgxp = void 0;
const resolveURLRgxp = /(?:^|^(\w+:\/\/\/?)(?:([^:]+:[^@]+)@)?([^:/]+)(?::(\d+))?)(\/.*|$)/,
  queryTplRgxp = /\/:(.+?)(\(.*?\))?(?=[\\/.?#]|$)/g;
exports.queryTplRgxp = queryTplRgxp;
exports.resolveURLRgxp = resolveURLRgxp;