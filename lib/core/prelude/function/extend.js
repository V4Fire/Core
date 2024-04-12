"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../core/prelude/extend"));
(0, _extend.default)(Function.prototype, 'addToPrototype', function addToPrototype(methods) {
  Object.assign(this.prototype, methods);
  return this;
});