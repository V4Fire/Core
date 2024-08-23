"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));
(0, _extend.default)(Object, 'get', (obj, path, opts) => {
  if (needCurriedOverload(obj, path)) {
    const curriedPath = obj,
      curriedOpts = path;
    return obj => Object.get(obj, Object.cast(curriedPath), Object.cast(curriedOpts));
  }
  const p = {
    separator: '.',
    ...(Object.isPlainObject(path) ? path : opts)
  };
  const get = path => {
    const chunks = Object.isString(path) ? path.split(p.separator) : path;
    let res = obj;
    for (let i = 0; i < chunks.length; i++) {
      if (res == null) {
        return;
      }
      const key = chunks[i];
      if (Object.isPromiseLike(res) && !(key in res)) {
        res = res.then(val => {
          if (val == null) {
            return;
          }
          if (Object.isMap(val) || Object.isWeakMap(val)) {
            return val.get(key);
          }
          return Object.cast(val)[key];
        });
      } else if (Object.isMap(res) || Object.isWeakMap(res)) {
        res = res.get(key);
      } else {
        res = Object.cast(res)[key];
      }
    }
    return res;
  };
  if (Object.isArray(path) || Object.isString(path)) {
    return get(path);
  }
  return get;
});
(0, _extend.default)(Object, 'has', (obj, path, opts) => {
  if (needCurriedOverload(obj, path)) {
    const curriedPath = obj,
      curriedOpts = path;
    return obj => Object.has(obj, Object.cast(curriedPath), Object.cast(curriedOpts));
  }
  const p = {
    separator: '.',
    ...(Object.isPlainObject(path) ? path : opts)
  };
  const has = path => {
    const chunks = Object.isString(path) ? path.split(p.separator) : path;
    let res = obj,
      i = 0;
    for (; i < chunks.length - 1; i++) {
      if (res == null) {
        return false;
      }
      const key = chunks[i];
      if (Object.isMap(res) || Object.isWeakMap(res)) {
        res = res.get(key);
      } else {
        res = Object.cast(res)[key];
      }
    }
    const key = chunks[i];
    if (res == null) {
      return false;
    }
    if (Object.isMap(res) || Object.isSet(res) || Object.isWeakMap(res) || Object.isWeakSet(res)) {
      return res.has(key);
    }
    if (typeof res === 'object') {
      return key in res;
    }
    return Object.cast(res)[key] !== undefined;
  };
  if (Object.isArray(path) || Object.isString(path)) {
    return has(path);
  }
  return has;
});
const {
  hasOwnProperty: nativeHasOwnProperty
} = Object.prototype;
(0, _extend.default)(Object, 'hasOwnProperty', function hasOwnProperty(obj, key) {
  if (this != null && this !== Object) {
    return nativeHasOwnProperty.call(this, obj);
  }
  if (arguments.length > 1) {
    if (obj == null) {
      return false;
    }
    return nativeHasOwnProperty.call(obj, key);
  }
  if (Object.isString(obj) || Object.isSymbol(obj)) {
    key = obj;
    return obj => Object.hasOwnProperty(obj, key);
  }
  return key => Object.hasOwnProperty(obj, key);
});
(0, _extend.default)(Object, 'defineSymbol', function defineSymbol(obj, symbol, value) {
  return Object.defineProperty(obj, symbol, {
    value,
    configurable: true,
    enumerable: false,
    writable: true
  });
});
(0, _extend.default)(Object, 'set', function set(obj, path, value, opts) {
  if (needCurriedOverload(obj, path)) {
    const curriedPath = obj,
      curriedOpts = path;
    return function wrapper(obj, newValue) {
      const val = arguments.length > 1 ? newValue : value;
      Object.set(obj, Object.cast(curriedPath), val, Object.cast(curriedOpts));
      return obj;
    };
  }
  const p = {
    separator: '.',
    concat: false,
    ...(Object.isPlainObject(path) ? path : opts)
  };
  if (Object.isArray(path) || Object.isString(path)) {
    if (arguments.length < 2) {
      return value => {
        set(path, value);
        return obj;
      };
    }
    return set(path, value);
  }
  return (path, ...args) => {
    set(path, ...args);
    return obj;
  };
  function set(path, newValue) {
    const finalValue = arguments.length > 1 ? newValue : value,
      chunks = Object.isString(path) ? path.split(p.separator) : path;
    let ref = obj,
      cursor;
    for (let i = 0; i < chunks.length; i++) {
      const key = chunks[i];
      if (chunks.length === i + 1) {
        cursor = key;
        continue;
      }
      const nextChunkIsObj = isNaN(Number(chunks[i + 1]));
      let isWeakMap;
      if (Object.isMap(ref) || (isWeakMap = Object.isWeakMap(ref))) {
        let val = ref.get(key);
        if (val == null || typeof val !== 'object') {
          if (isWeakMap === true && (key == null || typeof key !== 'object')) {
            return undefined;
          }
          val = nextChunkIsObj ? new Map() : [];
          if (p.setter != null) {
            p.setter(ref, key, val);
          } else {
            ref.set(key, val);
          }
        }
        ref = val;
      } else {
        const box = Object.cast(ref);
        let val = box[key];
        if (val == null || typeof val !== 'object') {
          val = nextChunkIsObj ? {} : [];
          if (p.setter != null) {
            p.setter(box, key, val);
          } else {
            box[key] = val;
          }
        }
        ref = val;
      }
    }
    let isWeakMap;
    if (Object.isMap(ref) || (isWeakMap = Object.isWeakMap(ref))) {
      if (isWeakMap === true && (cursor == null || typeof cursor !== 'object')) {
        return undefined;
      }
      const val = ref.has(cursor) && p.concat ? Array.toArray(ref[cursor], finalValue) : finalValue;
      if (p.setter != null) {
        p.setter(ref, cursor, val);
        return ref.get(cursor);
      }
      ref.set(cursor, val);
      return val;
    }
    const box = Object.cast(ref),
      val = cursor in box && p.concat ? Array.toArray(box[cursor], finalValue) : finalValue;
    if (p.setter != null) {
      p.setter(box, cursor, val);
      return box[cursor];
    }
    box[cursor] = val;
    return val;
  }
});
(0, _extend.default)(Object, 'delete', (obj, path, opts) => {
  if (needCurriedOverload(obj, path)) {
    const curriedPath = obj,
      curriedOpts = path;
    return obj => Object.delete(obj, Object.cast(curriedPath), Object.cast(curriedOpts));
  }
  const p = {
    separator: '.',
    ...(Object.isPlainObject(path) ? path : opts)
  };
  const del = path => {
    const chunks = Object.isString(path) ? path.split(p.separator) : path;
    let res = obj,
      i = 0;
    for (; i < chunks.length - 1; i++) {
      if (res == null) {
        return false;
      }
      const key = chunks[i];
      if (Object.isMap(res) || Object.isWeakMap(res)) {
        res = res.get(key);
      } else {
        res = Object.cast(res)[key];
      }
    }
    const key = chunks[i];
    if (res == null) {
      return false;
    }
    if (Object.isMap(res) || Object.isSet(res) || Object.isWeakMap(res) || Object.isWeakSet(res)) {
      return res.delete(key);
    }
    const box = Object.cast(res);
    if (typeof res === 'object' ? key in box : box[key] !== undefined) {
      return delete box[key];
    }
    return false;
  };
  if (Object.isArray(path) || Object.isString(path)) {
    return del(path);
  }
  return del;
});
function needCurriedOverload(obj, path) {
  return (Object.isString(obj) || Object.isArray(obj)) && (path == null || Object.isDictionary(path));
}