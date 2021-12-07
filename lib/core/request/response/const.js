"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noContentStatusCodes = exports.defaultResponseOpts = void 0;

var _range = _interopRequireDefault(require("../../../core/range"));

var _statusCodes = _interopRequireDefault(require("../../../core/status-codes"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const defaultResponseOpts = {
  responseType: 'text',
  okStatuses: new _range.default(200, 299),
  status: 200,
  headers: {}
};
/**
 * Status codes that cannot contain any content according to the HTTP standard
 *
 * 1xx - https://tools.ietf.org/html/rfc7231#section-6.2
 * 204 - https://tools.ietf.org/html/rfc7231#section-6.3.5
 * 304 - https://tools.ietf.org/html/rfc7232#section-4.1
 */

exports.defaultResponseOpts = defaultResponseOpts;
const noContentStatusCodes = [_statusCodes.default.NO_CONTENT, _statusCodes.default.NOT_MODIFIED].concat(new _range.default(100, 199).toArray(1));
exports.noContentStatusCodes = noContentStatusCodes;