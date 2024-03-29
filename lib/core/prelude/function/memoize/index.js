"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));
(0, _extend.default)(Function.prototype, 'once', function once() {
  const fn = this;
  let called = false,
    res;
  Object.defineProperty(wrapper, 'cancelOnce', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: () => {
      called = true;
      res = undefined;
    }
  });
  return wrapper;
  function wrapper(...args) {
    if (called) {
      return res;
    }
    res = fn.apply(this, args);
    called = true;
    return res;
  }
});
(0, _extend.default)(Function.prototype, 'cancelOnce', () => undefined);
(0, _extend.default)(Function, 'once', fn => fn.once());
(0, _extend.default)(Function, 'cancelOnce', fn => fn.cancelOnce());