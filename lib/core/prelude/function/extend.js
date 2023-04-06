"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../core/prelude/extend"));
(0, _extend.default)(Function.prototype, 'addToPrototype', function addToPrototype(...args) {
  const {
    prototype
  } = this;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (Object.isDictionary(arg)) {
      Object.assign(prototype, arg);
    } else {
      prototype[arg.name] = arg;
    }
  }
  return this;
});