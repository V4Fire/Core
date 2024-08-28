"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSerializer = createSerializer;
var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));
var _const = require("../../../../core/prelude/object/const");
(0, _extend.default)(Object, 'fastCompare', function fastCompare(a, b) {
  if (arguments.length < 2) {
    return b => Object.fastCompare(a, b);
  }
  a = Object.unwrapProxy(a);
  b = Object.unwrapProxy(b);
  const isEqual = a === b;
  if (isEqual) {
    return true;
  }
  const typeA = typeof a,
    typeB = typeof b;
  if (typeA !== typeB) {
    return false;
  }
  if (typeA !== 'object' || typeB !== 'object' || a == null || b == null) {
    return isEqual;
  }
  const objA = Object.cast(a),
    objB = Object.cast(b);
  if (objA.constructor !== objB.constructor) {
    return false;
  }
  if (Object.isRegExp(a)) {
    return a.toString() === objB.toString();
  }
  if (Object.isDate(a)) {
    return a.valueOf() === objB.valueOf();
  }
  const isArr = Object.isArray(a),
    isMap = !isArr && Object.isMap(a),
    isSet = !isMap && Object.isSet(a);
  const cantJSONCompare = !isArr && !Object.isDictionary(a) && (!Object.isFunction(objA['toJSON']) || !Object.isFunction(objB['toJSON']));
  if (cantJSONCompare) {
    if (isMap || isSet) {
      const setA = Object.cast(a),
        setB = Object.cast(b);
      if (setA.size !== setB.size) {
        return false;
      }
      if (setA.size === 0) {
        return true;
      }
      const aIter = setA.entries(),
        bIter = setB.entries();
      for (let aEl = aIter.next(), bEl = bIter.next(); !aEl.done; aEl = aIter.next(), bEl = bIter.next()) {
        const aVal = aEl.value,
          bVal = bEl.value;
        if (!Object.fastCompare(aVal[0], bVal[0]) || !Object.fastCompare(aVal[1], bVal[1])) {
          return false;
        }
      }
      return true;
    }
    return isEqual;
  }
  let length1, length2;
  if (isArr) {
    length1 = objA['length'];
    length2 = objB['length'];
  } else if (isMap || isSet) {
    length1 = objA['size'];
    length2 = objB['size'];
  } else {
    length1 = objA['length'] ?? Object.keys(objA).length;
    length2 = objB['length'] ?? Object.keys(objB).length;
  }
  if (length1 !== length2) {
    return false;
  }
  if (length1 === 0 && length2 === 0) {
    return true;
  }
  const cache = new WeakMap();
  return JSON.stringify(a, createSerializer(a, b, cache)) === JSON.stringify(b, createSerializer(a, b, cache));
});
(0, _extend.default)(Object, 'fastHash', obj => {
  if (Object.isPrimitive(obj)) {
    return cyrb53(obj == null ? 'null' : String(obj));
  }
  const res = JSON.stringify(obj, createSerializer(obj, undefined, _const.funcCache));
  return cyrb53(res !== '' ? res : 'null');
  function cyrb53(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
    h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
  }
});
function createSerializer(a, b, funcMap) {
  let init = false;
  return (key, value) => {
    if (value == null) {
      init = true;
      return Object.unwrapProxy(value);
    }
    const isObj = typeof value === 'object';
    if (init && isObj) {
      if (value === a) {
        return '[[OBJ_REF:a]]';
      }
      if (value === b) {
        return '[[OBJ_REF:b]]';
      }
    }
    if (!init) {
      init = true;
    }
    if (typeof value === 'function') {
      const key = funcMap.get(value) ?? `[[FUNC_REF:${Math.random()}]]`;
      funcMap.set(value, key);
      return key;
    }
    if (isObj && (value instanceof Map || value instanceof Set)) {
      return [...Object.unwrapProxy(value).entries()];
    }
    return Object.unwrapProxy(value);
  };
}