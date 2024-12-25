"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));
(0, _extend.default)(Function.prototype, 'memoize', function memoize() {
  const fn = this;
  let called = false,
    res;
  Object.defineProperty(wrapper, 'cancelmemoize', {
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
(0, _extend.default)(Function.prototype, 'cancelMemoize', () => undefined);
(0, _extend.default)(Function, 'memoize', fn => fn.memoize());
(0, _extend.default)(Function, 'cancelMemoize', fn => fn.cancelMemoize());