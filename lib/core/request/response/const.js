"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noContentStatusCodes = exports.defaultResponseOpts = void 0;
var _range = _interopRequireDefault(require("../../../core/range"));
var _statusCodes = _interopRequireDefault(require("../../../core/status-codes"));
const defaultResponseOpts = {
  url: '',
  redirected: false,
  status: 200,
  statusText: 'OK',
  okStatuses: new _range.default(200, 299),
  responseType: 'text',
  headers: {}
};
exports.defaultResponseOpts = defaultResponseOpts;
const noContentStatusCodes = [_statusCodes.default.NO_CONTENT, _statusCodes.default.NOT_MODIFIED].concat(new _range.default(100, 199).toArray(1));
exports.noContentStatusCodes = noContentStatusCodes;