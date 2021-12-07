"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFlagsModifier = createFlagsModifier;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
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