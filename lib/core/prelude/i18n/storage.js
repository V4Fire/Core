"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _kvStorage = require("../../../core/kv-storage");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const storage = _kvStorage.local.namespace('[[I18N]]');

var _default = storage;
exports.default = _default;