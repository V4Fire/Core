"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultToQueryStringParamsFilter = defaultToQueryStringParamsFilter;
exports.startSlashesRgxp = exports.isStrictAbsURL = exports.isAbsURL = exports.endSlashesRgxp = void 0;
const isAbsURL = /^(?:\w+:)?\/\//,
  isStrictAbsURL = /^\w+:\/\//;
exports.isStrictAbsURL = isStrictAbsURL;
exports.isAbsURL = isAbsURL;
const startSlashesRgxp = /^\/+/,
  endSlashesRgxp = /\/+$/;
exports.endSlashesRgxp = endSlashesRgxp;
exports.startSlashesRgxp = startSlashesRgxp;
function defaultToQueryStringParamsFilter(value) {
  return !(value == null || value === '' || Object.isArray(value) && value.length === 0);
}