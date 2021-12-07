"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/** @see [[Function.once]] */
(0, _extend.default)(Function.prototype, 'once', function once() {
  const // eslint-disable-next-line @typescript-eslint/no-this-alias
  fn = this;
  let called = false,
      res;
  return function wrapper(...args) {
    if (called) {
      return res;
    }

    res = fn.apply(this, args);
    called = true;
    return res;
  };
});
/** @see [[FunctionConstructor.once]] */

(0, _extend.default)(Function, 'once', fn => fn.once());