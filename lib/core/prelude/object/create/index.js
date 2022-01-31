"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEnumLike = createEnumLike;
exports.selectReject = selectReject;

var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));

var _functools = require("../../../../core/functools");

var _helpers = require("../../../../core/prelude/object/helpers");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/** @see [[ObjectConstructor.createDict]] */
(0, _extend.default)(Object, 'createDict', (...objects) => {
  if (objects.length > 0) {
    return Object.assign(Object.create(null), ...objects);
  }

  return Object.create(null);
});
/** @see [[ObjectConstructor.convertEnumToDict]] */

(0, _extend.default)(Object, 'convertEnumToDict', obj => {
  const res = Object.createDict();

  if (obj == null) {
    return res;
  }

  for (let keys = Object.keys(obj), i = 0; i < keys.length; i++) {
    const key = keys[i],
          el = obj[key];

    if (isNaN(Number(el))) {
      continue;
    }

    res[key] = key;
  }

  return res;
});
/** @see [[ObjectConstructor.createEnumLike]] */

(0, _extend.default)(Object, 'createEnumLike', createEnumLike);
/**
 * @deprecated
 * @see [[ObjectConstructor.createEnumLike]]
 */

(0, _extend.default)(Object, 'createMap', (0, _functools.deprecate)({
  renamedTo: 'createEnum'
}, createEnumLike));
/** @see [[ObjectConstructor.createEnumLike]] */

function createEnumLike(obj) {
  const map = Object.createDict();

  if (obj == null) {
    return map;
  }

  if (Object.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const el = obj[i];
      map[i] = el;
      map[el] = i;
    }
  } else {
    const keys = Object.keys(obj);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i],
            el = obj[key];
      map[key] = el;
      map[el] = key;
    }
  }

  return map;
}
/** @see [[ObjectConstructor.fromArray]] */


(0, _extend.default)(Object, 'fromArray', (arr, opts) => {
  const map = Object.createDict();

  if (arr == null) {
    return map;
  }

  const p = {
    key: String,
    value: () => true,
    ...opts
  };

  if (p.keyConverter != null) {
    p.key = (el, i) => {
      (0, _functools.deprecate)({
        type: 'property',
        name: 'keyConverter',
        renamedTo: 'key'
      });
      return p.keyConverter(i, el);
    };
  }

  if (p.valueConverter != null) {
    p.value = (el, i) => {
      (0, _functools.deprecate)({
        type: 'property',
        name: 'valueConverter',
        renamedTo: 'value'
      });
      return p.valueConverter(el, i);
    };
  }

  for (let i = 0; i < arr.length; i++) {
    map[p.key(arr[i], i)] = p.value(arr[i], i);
  }

  return map;
});
/** @see [[ObjectConstructor.select]] */

(0, _extend.default)(Object, 'select', selectReject(true));
/** @see [[ObjectConstructor.reject]] */

(0, _extend.default)(Object, 'reject', selectReject(false));
/**
 * Factory to create Object.select/reject functions
 * @param select
 */

function selectReject(select) {
  return function wrapper(obj, condition) {
    if (arguments.length === 1) {
      condition = Object.cast(obj);
      return obj => wrapper(obj, condition);
    }

    const res = (0, _helpers.getSameAs)(obj);

    if (res == null) {
      return {};
    }

    const filter = new Set();

    if (!Object.isRegExp(condition) && !Object.isFunction(condition)) {
      if (Object.isPrimitive(condition)) {
        filter.add(condition);
      } else if (Object.isIterable(condition)) {
        Object.forEach(condition, el => {
          filter.add(el);
        });
      } else {
        Object.forEach(condition, (el, key) => {
          if (Object.isTruly(el)) {
            filter.add(key);
          }
        });
      }
    }

    Object.forEach(obj, (el, key) => {
      let test;

      if (Object.isFunction(condition)) {
        test = Object.isTruly(condition(key, el));
      } else if (Object.isRegExp(condition)) {
        test = condition.test(String(key));
      } else {
        test = filter.has(key);
      }

      if (select ? test : !test) {
        if (Object.isArray(res)) {
          res.push(el);
        } else if (Object.isSet(res) || Object.isWeakSet(res)) {
          res.add(key);
        } else {
          Object.set(res, [key], el);
        }
      }
    });
    return res;
  };
}