"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  bindMutationHooks: true
};
exports.bindMutationHooks = bindMutationHooks;
var _helpers = require("../../../../core/object/watch/engines/helpers");
var _const = require("../../../../core/object/watch/const");
var _const2 = require("../../../../core/object/watch/wrap/const");
var _interface = require("../../../../core/object/watch/wrap/interface");
Object.keys(_interface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface[key];
    }
  });
});
function bindMutationHooks(obj, optsOrHandlers, handlersOrOpts) {
  let handlers, rawOpts;
  if (Object.isSet(handlersOrOpts)) {
    handlers = handlersOrOpts;
    if (Object.isPlainObject(optsOrHandlers)) {
      rawOpts = optsOrHandlers;
    }
  } else {
    if (Object.isSet(optsOrHandlers)) {
      handlers = optsOrHandlers;
    } else {
      handlers = new Set();
    }
    if (Object.isPlainObject(handlersOrOpts)) {
      rawOpts = handlersOrOpts;
    }
  }
  if (rawOpts == null) {
    throw new ReferenceError('Options of wrapping are not specified');
  }
  const opts = rawOpts;
  const wrappedCb = args => {
    if (args == null) {
      return;
    }
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      for (let o = handlers.values(), el = o.next(); !el.done; el = o.next()) {
        el.value(a[0], a[1], {
          obj,
          root: opts.root,
          top: opts.top,
          fromProto: Boolean(opts.fromProto),
          path: a[2]
        });
      }
    }
  };
  for (let i = 0, keys = Object.keys(_const2.structureWrappers); i < keys.length; i++) {
    const key = keys[i],
      el = _const2.structureWrappers[key];
    if (el == null || !el.is(obj, opts)) {
      continue;
    }
    const innerKeys = [].concat(Object.keys(el.methods), Object.getOwnPropertySymbols(el.methods));
    for (let i = 0; i < innerKeys.length; i++) {
      const methodName = innerKeys[i],
        method = el.methods[methodName],
        original = obj[methodName];
      if (method == null) {
        continue;
      }
      Object.defineProperty(obj, methodName, {
        writable: true,
        configurable: true,
        value: (...args) => {
          if (handlers.size === 0) {
            return original.apply(obj, args);
          }
          const wrapperOpts = {
            ...opts,
            handlers,
            original
          };
          if (Object.isFunction(method)) {
            const newArgs = method(obj, wrapperOpts, ...args),
              res = original.apply(obj, args);
            wrappedCb(newArgs);
            if (res === obj) {
              return (0, _helpers.getOrCreateLabelValueByHandlers)(obj, _const.toProxyObject, handlers);
            }
            return res;
          }
          if (method.type === 'get') {
            return method.value(obj, wrapperOpts, ...args);
          }
          const res = original.apply(obj, args);
          if (res === obj) {
            return (0, _helpers.getOrCreateLabelValueByHandlers)(obj, _const.toProxyObject, handlers);
          }
          return res;
        }
      });
    }
    break;
  }
  return obj;
}