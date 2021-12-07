"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const extend = func => {
  const res = func;

  function info(context, ...details) {
    func({
      context,
      logLevel: 'info'
    }, ...details);
  }

  res.info = info;

  function warn(context, ...details) {
    func({
      context,
      logLevel: 'warn'
    }, ...details);
  }

  res.warn = warn;

  function error(context, ...details) {
    func({
      context,
      logLevel: 'error'
    }, ...details);
  }

  res.error = error;

  function namespace(value) {
    const copy = (context, ...details) => {
      let contextCopy;

      if (Object.isString(context)) {
        contextCopy = `${value}:${context}`;
      } else {
        contextCopy = {
          context: `${value}:${context.context}`,
          logLevel: context.logLevel
        };
      }

      func(contextCopy, ...details);
    };

    return extend(copy);
  }

  res.namespace = namespace;
  return res;
};

var _default = extend;
exports.default = _default;