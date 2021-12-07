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

/** @see [[Function.debounce]] */
(0, _extend.default)(Function.prototype, 'debounce', function debounce(delay = 250) {
  const // eslint-disable-next-line @typescript-eslint/no-this-alias
  fn = this;
  let timer;
  return function wrapper(...args) {
    const cb = () => fn.apply(this, args);

    if (delay === 0) {
      clearImmediate(timer);
      timer = setImmediate(cb);
    } else {
      clearTimeout(timer);
      timer = setTimeout(cb, delay);
    }
  };
});
/** @see [[FunctionConstructor.debounce]] */

(0, _extend.default)(Function, 'debounce', (fn, delay) => {
  if (Object.isNumber(fn)) {
    delay = fn;
    return fn => Function.debounce(fn, delay);
  }

  return fn.debounce(delay);
});
/** @see [[Function.throttle]] */

(0, _extend.default)(Function.prototype, 'throttle', function throttle(delayOrOpts) {
  let opts = {};

  if (Object.isNumber(delayOrOpts)) {
    opts.delay = delayOrOpts;
  } else {
    opts = { ...delayOrOpts
    };
  }

  opts.delay = opts.delay ?? 250;
  const // eslint-disable-next-line @typescript-eslint/no-this-alias
  fn = this;
  let lastArgs, timer;
  return function wrapper(...args) {
    lastArgs = args;

    if (timer === undefined) {
      fn.apply(this, lastArgs);

      const cb = () => {
        timer = undefined;

        if (!opts.single && lastArgs !== args) {
          wrapper.apply(this, lastArgs);
        }
      };

      if (opts.delay === 0) {
        timer = setImmediate(cb);
      } else {
        timer = setTimeout(cb, opts.delay);
      }
    }
  };
});
/** @see [[FunctionConstructor.throttle]] */

(0, _extend.default)(Function, 'throttle', (fn, delayOrOpts) => {
  if (!Object.isFunction(fn)) {
    delayOrOpts = fn;
    return fn => Function.throttle(fn, Object.cast(delayOrOpts));
  }

  return fn.throttle(Object.cast(delayOrOpts));
});