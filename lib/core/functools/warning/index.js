"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  warn: true,
  warned: true
};
exports.warn = warn;
exports.warned = warned;
var _const = require("../../../core/functools/warning/const");
var _interface = require("../../../core/functools/warning/interface");
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
function warn(fnOrParams, fn) {
  let p;
  if (Object.isSimpleFunction(fnOrParams)) {
    fn = fnOrParams;
    p = {};
  } else {
    p = fnOrParams;
  }
  if (!fn) {
    wrapper();
    return;
  }
  wrapper[p.context ?? 'warning'] = p;
  function wrapper(...args) {
    const name = p.name ?? fn?.name,
      type = p.type ?? 'function',
      wasMovedOrRenamed = p.movedTo != null || p.renamedTo != null;
    const msg = [];
    switch (p.context) {
      case 'deprecated':
        if (!wasMovedOrRenamed) {
          msg.push(`The ${type} "${name}" was deprecated and will be removed from the next major release.`);
        }
        break;
      case 'unimplemented':
        if (!wasMovedOrRenamed) {
          msg.push(`The ${type} "${name}" is unimplemented.`);
        }
        break;
      default:
        if (!wasMovedOrRenamed && p.notice == null) {
          msg.push(`The ${type} "${name}" is not recommended to use.`);
        }
    }
    if (wasMovedOrRenamed) {
      if (p.movedTo == null) {
        msg.push(`The ${type} "${name}" was renamed to "${p.renamedTo}".`, 'Please use the renamed version instead of the current, because it will be removed from the next major release.');
      } else if (p.renamedTo == null) {
        msg.push(`The ${type} "${name}" was moved to a new location "${p.movedTo}".`, 'Please use the moved version instead of the current, because it will be removed from the next major release.');
      } else {
        msg.push(`The ${type} "${name}" was renamed to "${p.renamedTo}" and moved to a new location "${p.movedTo}".`, 'Please use the new version instead of the current, because it will be removed from the next major release.');
      }
    }
    if (p.alternative != null) {
      if (Object.isString(p.alternative)) {
        msg.push(`Please use "${p.alternative}" instead.`);
      } else if (p.alternative.source != null) {
        msg.push(`Please use "${p.alternative.name}" from "${p.alternative.source}" instead.`);
      } else {
        msg.push(`Please use "${p.alternative.name}" instead.`);
      }
    }
    if (p.notice != null) {
      msg.push(p.notice);
    }
    const str = msg.join(' ');
    if (p.context === 'unimplemented') {
      throw new Error(str);
    } else if (_const.consoleCache[str] == null) {
      console.warn(str);
      _const.consoleCache[str] = true;
    }
    return fn?.apply(this, args);
  }
  return Object.cast(wrapper);
}
function warned(opts, key, descriptor) {
  const f = (name, descriptor, opts) => {
    const {
      get,
      set,
      value: method
    } = descriptor;
    if (get != null) {
      descriptor.get = warn({
        type: 'accessor',
        ...opts,
        name
      }, get);
    }
    if (set != null) {
      descriptor.set = warn({
        type: 'accessor',
        ...opts,
        name
      }, set);
    }
    if (get != null || set != null) {
      return;
    }
    if (!Object.isFunction(method)) {
      throw new TypeError(`descriptor.value is not a function: ${method}`);
    }
    descriptor.value = warn({
      type: 'method',
      ...opts,
      name
    }, method);
  };
  if (arguments.length > 1) {
    f(key, descriptor);
    return;
  }
  return (target, key, descriptor) => f(key, descriptor, opts);
}