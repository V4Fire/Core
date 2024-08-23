"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = set;
exports.setWatchAccessors = setWatchAccessors;
exports.unset = unset;
exports.watch = watch;
var _const = require("../../../../core/object/watch/const");
var _wrap = require("../../../../core/object/watch/wrap");
var _helpers = require("../../../../core/object/watch/engines/helpers");
function watch(obj, path, handler, handlers, opts, root, top) {
  opts ??= {};
  const unwrappedObj = (0, _helpers.unwrap)(obj),
    resolvedRoot = root ?? unwrappedObj;
  const returnProxy = (obj, proxy) => {
    if (proxy != null && handler != null && (!top || !handlers.has(handler))) {
      handlers.add(handler);
    }
    if (top) {
      return proxy ?? obj;
    }
    return {
      proxy: proxy ?? obj,
      set: (path, value) => {
        set(obj, path, value, handlers);
      },
      delete: path => {
        unset(obj, path, handlers);
      },
      unwatch() {
        if (handler != null) {
          handlers.delete(handler);
        }
      }
    };
  };
  if (unwrappedObj == null || resolvedRoot == null) {
    return returnProxy(obj);
  }
  if (!top) {
    const tmpOpts = (0, _helpers.getOrCreateLabelValueByHandlers)(unwrappedObj, _const.watchOptions, handlers, {
      ...opts
    });
    if (opts.deep) {
      tmpOpts.deep = true;
    }
    if (opts.withProto) {
      tmpOpts.withProto = true;
    }
    opts = tmpOpts;
  }
  let proxy = (0, _helpers.getOrCreateLabelValueByHandlers)(unwrappedObj, _const.toProxyObject, handlers);
  if (proxy) {
    return returnProxy(unwrappedObj, proxy);
  }
  if ((0, _helpers.getProxyType)(unwrappedObj) == null) {
    return returnProxy(unwrappedObj);
  }
  const fromProto = Boolean(opts.fromProto),
    resolvedPath = path ?? [];
  const wrapOpts = {
    root: resolvedRoot,
    top,
    path: resolvedPath,
    originalPath: resolvedPath,
    fromProto,
    watchOpts: opts
  };
  if (Object.isArray(unwrappedObj)) {
    (0, _wrap.bindMutationHooks)(unwrappedObj, wrapOpts, handlers);
    const arrayProxy = (0, _helpers.getOrCreateLabelValueByHandlers)(unwrappedObj, _const.toProxyObject, handlers, unwrappedObj);
    proxy = arrayProxy;
    for (let i = 0; i < arrayProxy.length; i++) {
      arrayProxy[i] = (0, _helpers.getProxyValue)(arrayProxy[i], i, path, handlers, resolvedRoot, top, opts);
    }
  } else if (Object.isDictionary(unwrappedObj)) {
    proxy = (0, _helpers.getOrCreateLabelValueByHandlers)(unwrappedObj, _const.toProxyObject, handlers, () => Object.create(unwrappedObj));
    for (const key in unwrappedObj) {
      let propFromProto = fromProto;
      if (!Object.hasOwnProperty(unwrappedObj, key)) {
        propFromProto = !propFromProto ? 1 : true;
        if (Object.isTruly(opts.fromProto) && !opts.withProto) {
          continue;
        }
      }
      const watchOpts = Object.assign(Object.create(opts), {
        fromProto: propFromProto
      });
      setWatchAccessors(unwrappedObj, key, path, handlers, resolvedRoot, top, watchOpts);
    }
  } else {
    (0, _wrap.bindMutationHooks)(unwrappedObj, wrapOpts, handlers);
    proxy = (0, _helpers.getOrCreateLabelValueByHandlers)(unwrappedObj, _const.toProxyObject, handlers, unwrappedObj);
  }
  Object.defineProperty(proxy, _const.watchPath, {
    configurable: true,
    value: path
  });
  Object.defineProperty(proxy, _const.watchHandlers, {
    configurable: true,
    value: handlers
  });
  Object.defineProperty(proxy, _const.toRootObject, {
    configurable: true,
    value: resolvedRoot
  });
  Object.defineProperty(proxy, _const.toTopObject, {
    configurable: true,
    value: top
  });
  Object.defineProperty(proxy, _const.toOriginalObject, {
    configurable: true,
    value: unwrappedObj
  });
  return returnProxy(unwrappedObj, proxy);
}
function set(obj, path, value, handlers) {
  const unwrappedObj = (0, _helpers.unwrap)(obj);
  if (unwrappedObj == null) {
    return;
  }
  const normalizedPath = Object.isArray(path) ? path : path.split('.'),
    prop = normalizedPath[normalizedPath.length - 1];
  const ctxPath = obj[_const.watchPath] ?? [],
    refPath = Array.toArray(ctxPath.slice(1), normalizedPath.slice(0, -1)),
    fullRefPath = Array.toArray(ctxPath.slice(0, 1), refPath);
  if (normalizedPath.length > 1 && Object.get(unwrappedObj, refPath) == null) {
    Object.set(unwrappedObj, refPath, {}, {
      setter: (ref, key, val) => {
        if (ref == null || typeof ref !== 'object') {
          return;
        }
        ref[_const.muteLabel] = true;
        set(ref, [key], val, handlers);
        ref[_const.muteLabel] = false;
      }
    });
  }
  const proxy = (0, _helpers.getOrCreateLabelValueByHandlers)(unwrappedObj, _const.toProxyObject, handlers);
  const root = proxy?.[_const.toTopObject] ?? unwrappedObj,
    top = proxy?.[_const.toTopObject] ?? unwrappedObj;
  const ref = Object.get(top, refPath);
  if (ref == null) {
    throw new TypeError('Invalid data type to watch');
  }
  switch ((0, _helpers.getProxyType)(ref)) {
    case 'set':
      throw new TypeError('Invalid data type to watch');
    case 'array':
      ref.splice(Number(prop), 1, value);
      break;
    case 'map':
      ref.set(prop, value);
      break;
    default:
      {
        const key = String(prop),
          hasPath = fullRefPath.length > 0;
        const resolvedPath = hasPath ? fullRefPath : undefined,
          resolvedRoot = hasPath ? root : unwrappedObj,
          resolvedTop = hasPath ? top : undefined;
        const refProxy = ref[_const.toProxyObject]?.get(handlers) ?? Object.createDict();
        if (!Object.isFunction(Object.getOwnPropertyDescriptor(refProxy, key)?.get)) {
          ref[key] = refProxy[key];
        }
        const resolvedProxy = setWatchAccessors(ref, key, resolvedPath, handlers, resolvedRoot, resolvedTop, {
          deep: true
        });
        resolvedProxy[key] = value;
      }
  }
}
function unset(obj, path, handlers) {
  const unwrappedObj = (0, _helpers.unwrap)(obj);
  if (!unwrappedObj) {
    return;
  }
  const normalizedPath = Object.isArray(path) ? path : path.split('.'),
    prop = normalizedPath[normalizedPath.length - 1];
  const ctxPath = obj[_const.watchPath] ?? [],
    refPath = Array.toArray(ctxPath.slice(1), normalizedPath.slice(0, -1)),
    fullRefPath = Array.toArray(ctxPath.slice(0, 1), refPath);
  const proxy = (0, _helpers.getOrCreateLabelValueByHandlers)(unwrappedObj, _const.toProxyObject, handlers),
    root = proxy?.[_const.toTopObject] ?? unwrappedObj,
    top = proxy?.[_const.toTopObject] ?? unwrappedObj;
  const ref = Object.get(top, refPath),
    type = (0, _helpers.getProxyType)(ref);
  switch (type) {
    case null:
      return;
    case 'array':
      ref.splice(Number(prop), 1);
      break;
    case 'map':
    case 'set':
      ref.delete(prop);
      break;
    default:
      {
        const key = String(prop);
        const hasPath = fullRefPath.length > 0,
          resolvedPath = hasPath ? fullRefPath : undefined,
          resolvedRoot = hasPath ? root : unwrappedObj,
          resolvedTop = hasPath ? top : undefined;
        const resolvedProxy = setWatchAccessors(ref, key, resolvedPath, handlers, resolvedRoot, resolvedTop, {
          deep: true
        });
        resolvedProxy[key] = undefined;
        delete resolvedProxy[key];
      }
  }
}
function setWatchAccessors(obj, key, path, handlers, root, top, opts) {
  const proxy = (0, _helpers.getOrCreateLabelValueByHandlers)(obj, _const.toProxyObject, handlers, Object.create(obj));
  const descriptors = Object.getOwnPropertyDescriptor(obj, key);
  if (!descriptors || descriptors.configurable) {
    Object.defineProperty(proxy, key, {
      configurable: true,
      enumerable: true,
      get() {
        const val = obj[key];
        if (root[_const.muteLabel] === true) {
          return val;
        }
        return (0, _helpers.getProxyValue)(val, key, path, handlers, root, top, opts);
      },
      set(val) {
        let fromProto = opts?.fromProto ?? false,
          oldVal = obj[key];
        val = (0, _helpers.unwrap)(val) ?? val;
        oldVal = (0, _helpers.unwrap)(oldVal) ?? oldVal;
        if (oldVal !== val) {
          try {
            obj[key] = val;
            if (root[_const.muteLabel] === true) {
              return;
            }
            if (fromProto === 1) {
              fromProto = false;
              if (opts != null) {
                opts.fromProto = fromProto;
              }
            }
          } catch {
            return;
          }
          handlers.forEach(handler => {
            const resolvedPath = Array.toArray(path ?? [], key);
            handler(val, oldVal, {
              obj,
              root,
              top,
              path: resolvedPath,
              fromProto: Boolean(fromProto)
            });
          });
        }
      }
    });
  }
  return proxy;
}