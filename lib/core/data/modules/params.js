"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _functools = require("../../../core/functools");
var _request = _interopRequireDefault(require("../../../core/request"));
var _select = _interopRequireDefault(require("../../../core/object/select"));
var _const = require("../../../core/data/const");
class Provider {
  static request = _request.default;
  static middlewares = {};
  static encoders = {};
  static decoders = {};
  static select(obj, params) {
    return (0, _select.default)(obj, params);
  }
  globalEmitter = _const.emitter;
  baseURL = '';
  advURL = '';
  getMethod = 'GET';
  peekMethod = 'HEAD';
  addMethod = 'POST';
  updMethod = 'PUT';
  delMethod = 'DELETE';
  get globalEvent() {
    (0, _functools.deprecate)({
      name: 'globalEvent',
      type: 'accessor',
      renamedTo: 'globalEmitter'
    });
    return this.globalEmitter;
  }
  get request() {
    return this.constructor.request;
  }
}
exports.default = Provider;