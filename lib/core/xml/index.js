"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toDataURI = toDataURI;

var _const = require("../../core/xml/const");

var _engines = require("../../core/xml/engines");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/xml/README.md]]
 * @packageDocumentation
 */

/**
 * Converts the specified XML node to a DATA:URI string
 * @param node
 */
function toDataURI(node) {
  return `data:image/svg+xml;${(0, _engines.serialize)(node).replace(_const.normalizeRgxp, normalize)}`;

  function normalize(str, sp) {
    if (str === '"') {
      return "'";
    }

    if (sp != null) {
      return ' ';
    }

    return `%${str[0].charCodeAt(0).toString(16).toUpperCase()}`;
  }
}