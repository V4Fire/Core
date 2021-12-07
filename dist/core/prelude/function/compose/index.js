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

/** @see [[FunctionConstructor.compose]] */
(0, _extend.default)(Function, 'compose', (...fns) => function wrapper(...args) {
  if (fns.length === 0) {
    return;
  }

  let i = fns.length,
      res;

  while (i-- > 0) {
    const fn = fns[i];

    if (fn != null) {
      res = fn.apply(this, args);
      break;
    }
  }

  while (i-- > 0) {
    const fn = fns[i];

    if (fn != null) {
      if (Object.isPromise(res)) {
        res = res.then(res => fn.call(this, res));
      } else {
        res = fn.call(this, res);
      }
    }
  }

  return res;
});
/** @see [[Function.compose]] */

(0, _extend.default)(Function.prototype, 'compose', function compose(...fns) {
  const that = this;
  return function wrapper(...args) {
    let res = that.apply(this, args);

    for (let i = 0; i < fns.length; i++) {
      const fn = fns[i];

      if (fn != null) {
        if (Object.isPromise(res)) {
          res = res.then(res => fn.call(this, res));
        } else {
          res = fn.call(this, res);
        }
      }
    }

    return res;
  };
});