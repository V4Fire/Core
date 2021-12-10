"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.namespaces = exports.linkNamesDictionary = void 0;

var _interface = require("../../core/async/interface");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const namespaces = Object.convertEnumToDict(_interface.Namespaces),

/** @deprecated */
linkNamesDictionary = namespaces;
exports.linkNamesDictionary = linkNamesDictionary;
exports.namespaces = namespaces;