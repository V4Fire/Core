"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = set;
exports.unset = unset;
exports.watch = watch;
var _const = require("../../../../core/object/watch/const");
var _wrap = require("../../../../core/object/watch/wrap");
var _helpers = require("../../../../core/object/watch/helpers");
var _helpers2 = require("../../../../core/object/watch/engines/helpers");
function watch(obj, path, handler, handlers, opts, root, top) {
  opts ??= {};
  const unwrappedObj = (0, _helpers2.unwrap)(obj),
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
      unwatch: () => {
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
    const tmpOpts = (0, _helpers2.getOrCreateLabelValueByHandlers)(unwrappedObj, _const.watchOptions, handlers, {
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
  let proxy = (0, _helpers2.getOrCreateLabelValueByHandlers)(unwrappedObj, _const.toProxyObject, handlers);
  if (proxy != null) {
    return returnProxy(unwrappedObj, proxy);
  }
  if ((0, _helpers2.getProxyType)(unwrappedObj) == null) {
    return returnProxy(unwrappedObj);
  }
  const fromProto = Boolean(opts.fromProto),
    resolvedPath = path ?? [];
  if (!Object.isDictionary(unwrappedObj)) {
    const wrapOpts = {
      root: resolvedRoot,
      top,
      path: resolvedPath,
      originalPath: resolvedPath,
      fromProto,
      watchOpts: opts
    };
    (0, _wrap.bindMutationHooks)(unwrappedObj, wrapOpts, handlers);
  }
  const frozenKeys = Object.createDict({
    [_const.toRootObject]: true,
    [_const.toTopObject]: true,
    [_const.toOriginalObject]: true,
    [_const.watchHandlers]: true,
    [_const.watchPath]: true
  });
  const blackListStore = new Set();
  let lastSetKey;
  proxy = new Proxy(unwrappedObj, {
    get: (target, key) => {
      switch (key) {
        case _const.toRootObject:
          return resolvedRoot;
        case _const.toTopObject:
          return top;
        case _const.toOriginalObject:
          return target;
        case _const.watchHandlers:
          return handlers;
        case _const.watchPath:
          return path;
        default:
      }
      const val = target[key];
      if (Object.isPrimitive(val) || resolvedRoot[_const.muteLabel] === true) {
        return val;
      }
      const isArray = Object.isArray(target),
        isCustomObject = isArray || Object.isCustomObject(target);
      if (isArray && !Reflect.has(target, Symbol.isConcatSpreadable)) {
        Object.defineSymbol(target, Symbol.isConcatSpreadable, true);
      }
      if (Object.isSymbol(key) || blackListStore.has(key)) {
        if (isCustomObject) {
          return val;
        }
      } else if (isCustomObject) {
        let propFromProto = fromProto,
          normalizedKey;
        if (isArray && (0, _helpers.isValueCanBeArrayIndex)(key)) {
          normalizedKey = Number(key);
        } else {
          normalizedKey = key;
          const desc = Reflect.getOwnPropertyDescriptor(target, key);
          if (desc?.writable === false && desc.configurable === false) {
            return val;
          }
        }
        if (propFromProto || !isArray && !Object.hasOwnProperty(target, key)) {
          propFromProto = true;
        }
        const watchOpts = Object.assign(Object.create(opts), {
          fromProto: propFromProto
        });
        return (0, _helpers2.getProxyValue)(val, normalizedKey, path, handlers, resolvedRoot, top, watchOpts);
      }
      return Object.isFunction(val) ? val.bind(target) : val;
    },
    set: (target, key, val, receiver) => {
      if (frozenKeys[key]) {
        return false;
      }
      lastSetKey = key;
      val = (0, _helpers2.unwrap)(val) ?? val;
      const isArray = Object.isArray(target),
        isCustomObj = isArray || Object.isCustomObject(target),
        set = () => Reflect.set(target, key, val, isCustomObj ? receiver : target);
      const canSetWithoutEmit = Object.isSymbol(key) || resolvedRoot[_const.muteLabel] === true || blackListStore.has(key);
      if (canSetWithoutEmit) {
        return set();
      }
      let normalizedKey;
      if (isArray && (0, _helpers.isValueCanBeArrayIndex)(key)) {
        normalizedKey = Number(key);
      } else {
        normalizedKey = key;
      }
      let oldVal = Reflect.get(target, normalizedKey, isCustomObj ? receiver : target);
      oldVal = (0, _helpers2.unwrap)(oldVal) ?? oldVal;
      if (oldVal !== val && set()) {
        if (!opts.withProto && (fromProto || !isArray && !Object.hasOwnProperty(target, key))) {
          return true;
        }
        handlers.forEach(handler => {
          const path = resolvedPath.concat(normalizedKey);
          handler(val, oldVal, {
            obj: unwrappedObj,
            root: resolvedRoot,
            top,
            fromProto,
            path
          });
        });
      }
      return true;
    },
    defineProperty: (target, key, desc) => {
      if (frozenKeys[key]) {
        return false;
      }
      const define = desc => Reflect.defineProperty(target, key, desc);
      if (lastSetKey === key) {
        lastSetKey = undefined;
        return define(desc);
      }
      const canDefineWithoutEmit = Object.isSymbol(key) || resolvedRoot[_const.muteLabel] === true || blackListStore.has(key);
      if (canDefineWithoutEmit) {
        return define(desc);
      }
      const {
        configurable,
        writable
      } = desc;
      const mergedDesc = {
        ...desc
      };
      let valToDefine;
      const needRedefineValue = desc.get == null && desc.set == null && 'value' in desc && desc.value !== Reflect.get(target, key, proxy);
      if (needRedefineValue) {
        valToDefine = desc.value;
        mergedDesc.value = undefined;
        mergedDesc.configurable = true;
        mergedDesc.writable = true;
      }
      const res = define(mergedDesc);
      if (res) {
        if (valToDefine !== undefined) {
          Object.cast(proxy)[key] = valToDefine;
          define({
            configurable,
            writable
          });
        }
        return true;
      }
      return false;
    },
    deleteProperty: (target, key) => {
      if (frozenKeys[key]) {
        return false;
      }
      if (Reflect.deleteProperty(target, key)) {
        if (resolvedRoot[_const.muteLabel] === true) {
          return true;
        }
        if (Object.isDictionary(target) || Object.isMap(target) || Object.isWeakMap(target)) {
          blackListStore.add(key);
        }
        return true;
      }
      return false;
    },
    has: (target, key) => {
      if (frozenKeys[key]) {
        return true;
      }
      if (blackListStore.has(key)) {
        return false;
      }
      return Reflect.has(target, key);
    }
  });
  (0, _helpers2.getOrCreateLabelValueByHandlers)(unwrappedObj, _const.blackList, handlers, blackListStore);
  (0, _helpers2.getOrCreateLabelValueByHandlers)(unwrappedObj, _const.toProxyObject, handlers, proxy);
  return returnProxy(unwrappedObj, proxy);
}
function set(obj, path, value, handlers) {
  const unwrappedObj = (0, _helpers2.unwrap)(obj);
  if (!unwrappedObj) {
    return;
  }
  const normalizedPath = Object.isArray(path) ? path : path.split('.');
  const prop = normalizedPath[normalizedPath.length - 1],
    refPath = normalizedPath.slice(0, -1);
  if (normalizedPath.length > 1 && Object.get(obj, refPath) == null) {
    unwrappedObj[_const.muteLabel] = true;
    Object.set(obj, refPath, {});
    unwrappedObj[_const.muteLabel] = false;
  }
  const ref = Object.get((0, _helpers2.getOrCreateLabelValueByHandlers)(unwrappedObj, _const.toProxyObject, handlers) ?? unwrappedObj, refPath);
  const blackListStore = (0, _helpers2.getOrCreateLabelValueByHandlers)(unwrappedObj, _const.blackList, handlers),
    type = (0, _helpers2.getProxyType)(ref);
  switch (type) {
    case 'set':
      throw new TypeError('Invalid data type to watch');
    case 'array':
      ref.splice(Number(prop), 1, value);
      break;
    case 'map':
      blackListStore?.delete(prop);
      ref.set(prop, value);
      break;
    default:
      {
        const key = String(prop),
          store = ref;
        blackListStore?.delete(key);
        store[key] = value;
      }
  }
}
function unset(obj, path, handlers) {
  const unwrappedObj = (0, _helpers2.unwrap)(obj);
  if (!unwrappedObj) {
    return;
  }
  const normalizedPath = Object.isArray(path) ? path : path.split('.');
  const prop = normalizedPath[normalizedPath.length - 1],
    refPath = normalizedPath.slice(0, -1);
  const ref = Object.get((0, _helpers2.getOrCreateLabelValueByHandlers)(unwrappedObj, _const.toProxyObject, handlers) ?? unwrappedObj, refPath);
  const blackListStore = (0, _helpers2.getOrCreateLabelValueByHandlers)(unwrappedObj, _const.blackList, handlers),
    type = (0, _helpers2.getProxyType)(ref);
  switch (type) {
    case null:
      return;
    case 'array':
      ref.splice(Number(prop), 1);
      break;
    case 'map':
    case 'set':
      blackListStore?.delete(prop);
      ref.delete(prop);
      break;
    default:
      {
        const key = String(prop),
          store = ref;
        blackListStore?.delete(key);
        store[key] = undefined;
        delete store[key];
      }
  }
}