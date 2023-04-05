"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFlagsModifier = createFlagsModifier;
function createFlagsModifier(method) {
  return function flagsModifier(rgxp, ...flags) {
    if (Object.isString(rgxp)) {
      const flag = rgxp;
      return rgxp => rgxp[method](flag);
    }
    if (arguments.length === 1) {
      return (...flags) => rgxp[method](...flags);
    }
    return rgxp[method](...flags);
  };
}