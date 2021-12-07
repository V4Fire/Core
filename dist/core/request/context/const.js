"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveURLRgxp = exports.queryTplRgxp = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const resolveURLRgxp = /(?:^|^(\w+:\/\/\/?)(?:([^:]+:[^@]+)@)?([^:/]+)(?::(\d+))?)(\/.*|$)/,
      queryTplRgxp = /\/:(.+?)(\(.*?\))?(?=[\\/.?#]|$)/g;
exports.queryTplRgxp = queryTplRgxp;
exports.resolveURLRgxp = resolveURLRgxp;