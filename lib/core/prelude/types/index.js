"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extend = _interopRequireDefault(require("../../../core/prelude/extend"));

var _functools = require("../../../core/functools");

var _const = require("../../../core/prelude/types/const");

/* eslint-disable @typescript-eslint/strict-boolean-expressions */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/** @see [[ObjectConstructor.cast]] */
(0, _extend.default)(Object, 'cast', value => value);
/** @see [[ObjectConstructor.throw]] */

(0, _extend.default)(Object, 'throw', (err = 'This is a loopback function or method') => {
  if (Object.isString(err)) {
    throw new Error(err);
  }

  throw err;
});
/** @see [[ObjectConstructor.isTruly]] */

(0, _extend.default)(Object, 'isTruly', value => Boolean(value));
/** @see [[ObjectConstructor.isPrimitive]] */

(0, _extend.default)(Object, 'isPrimitive', value => !value || !_const.nonPrimitiveTypes[typeof value]);
/** @see [[ObjectConstructor.isDictionary]] */

(0, _extend.default)(Object, 'isDictionary', isPlainObject);
/** @see [[ObjectConstructor.isPlainObject]] */

(0, _extend.default)(Object, 'isPlainObject', isPlainObject);

function isPlainObject(value) {
  value = Object.unwrapProxy(value);

  if (!value || typeof value !== 'object') {
    return false;
  }

  const constr = value.constructor; // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition

  return !constr || constr === Object;
}
/** @see [[ObjectConstructor.isCustomObject]] */


(0, _extend.default)(Object, 'isCustomObject', value => {
  value = Object.unwrapProxy(value);
  let type;

  if (!value || !_const.nonPrimitiveTypes[type = typeof value]) {
    return false;
  }

  if (type === 'function') {
    return !_const.isNative.test(value.toString());
  }

  const constr = value.constructor;
  return !constr || constr === Object || !_const.isNative.test(constr.toString());
});
/** @see [[ObjectConstructor.isSimpleObject]] */

(0, _extend.default)(Object, 'isSimpleObject', value => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return _const.toString.call(value) === '[object Object]';
});
/** @see [[ObjectConstructor.isArray]] */

(0, _extend.default)(Object, 'isArray', Array.isArray);
/** @see [[ObjectConstructor.isArrayLike]] */

(0, _extend.default)(Object, 'isArrayLike', value => {
  const t = typeof value;

  if (value == null || t !== 'object') {
    return t === 'string';
  }

  return Array.isArray(value) || value.length > 0 && 0 in value || value.length === 0;
});
/** @see [[ObjectConstructor.isFunction]] */

(0, _extend.default)(Object, 'isFunction', value => typeof value === 'function');
/** @see [[ObjectConstructor.isSimpleFunction]] */

(0, _extend.default)(Object, 'isSimpleFunction', value => typeof value === 'function');
/** @see [[ObjectConstructor.isGenerator]] */

(0, _extend.default)(Object, 'isGenerator', value => typeof value === 'function' && value.constructor.name === 'GeneratorFunction');
/** @see [[ObjectConstructor.isAsyncGenerator]] */

(0, _extend.default)(Object, 'isAsyncGenerator', value => typeof value === 'function' && value.constructor.name === 'AsyncGeneratorFunction');
/** @see [[ObjectConstructor.isIterator]] */

(0, _extend.default)(Object, 'isIterator', value => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return typeof value.next === 'function';
});
/** @see [[ObjectConstructor.isAsyncIterator]] */

(0, _extend.default)(Object, 'isAsyncIterator', value => Object.isIterator(value) && Object.isAsyncIterable(value));
/** @see [[ObjectConstructor.isIterable]] */

(0, _extend.default)(Object, 'isIterable', value => {
  if (value == null) {
    return false;
  }

  return Boolean(typeof Symbol === 'function' ? value[Symbol.iterator] : typeof value['@@iterator'] === 'function');
});
/** @see [[ObjectConstructor.isAsyncIterable]] */

(0, _extend.default)(Object, 'isAsyncIterable', value => {
  if (value == null) {
    return false;
  }

  return Boolean(typeof Symbol === 'function' ? value[Symbol.asyncIterator] : typeof value['@@asyncIterator'] === 'function');
});
/** @see [[ObjectConstructor.isString]] */

(0, _extend.default)(Object, 'isString', value => typeof value === 'string');
/** @see [[ObjectConstructor.isNumber]] */

(0, _extend.default)(Object, 'isNumber', value => typeof value === 'number');
/** @see [[ObjectConstructor.isBoolean]] */

(0, _extend.default)(Object, 'isBoolean', value => typeof value === 'boolean');
/** @see [[ObjectConstructor.isSymbol]] */

(0, _extend.default)(Object, 'isSymbol', value => typeof value === 'symbol');
/** @see [[ObjectConstructor.isRegExp]] */

(0, _extend.default)(Object, 'isRegExp', value => value instanceof RegExp);
/** @see [[ObjectConstructor.isDate]] */

(0, _extend.default)(Object, 'isDate', value => value instanceof Date);
/** @see [[ObjectConstructor.isPromise]] */

(0, _extend.default)(Object, 'isPromise', value => {
  if (value) {
    return typeof value.then === 'function' && typeof value.catch === 'function';
  }

  return false;
});
/** @see [[ObjectConstructor.isPromiseLike]] */

(0, _extend.default)(Object, 'isPromiseLike', value => {
  if (value) {
    return typeof value.then === 'function';
  }

  return false;
});
/** @see [[ObjectConstructor.isProxy]] */

(0, _extend.default)(Object, 'isProxy', value => value?.[_const.PROXY] != null);
/** @see [[ObjectConstructor.unwrapProxy]] */

(0, _extend.default)(Object, 'unwrapProxy', value => {
  while (value?.[_const.PROXY] && value[_const.PROXY] !== value) {
    value = value[_const.PROXY];
  }

  return value;
});
/** @see [[ObjectConstructor.isMap]] */

(0, _extend.default)(Object, 'isMap', value => value instanceof Map);
/** @see [[ObjectConstructor.isWeakMap]] */

(0, _extend.default)(Object, 'isWeakMap', value => value instanceof WeakMap);
/** @see [[ObjectConstructor.isSet]] */

(0, _extend.default)(Object, 'isSet', value => value instanceof Set);
/** @see [[ObjectConstructor.isWeakSet]] */

(0, _extend.default)(Object, 'isWeakSet', value => value instanceof WeakSet);
/**
 * @deprecated
 * @see [[ObjectConstructor.isDictionary]]
 */

(0, _extend.default)(Object, 'isObject', (0, _functools.deprecate)({
  name: 'isObject',
  renamedTo: 'isDictionary'
}, isPlainObject));
const {
  isExtensible,
  isSealed,
  isFrozen
} = Object;

Object.isExtensible = value => {
  if (value == null || value[_const.READONLY] === true) {
    return false;
  }

  return isExtensible(value);
};

Object.isSealed = value => value == null || isSealed(value) || value[_const.READONLY] === true;

Object.isFrozen = value => value == null || isFrozen(value) || value[_const.READONLY] === true;