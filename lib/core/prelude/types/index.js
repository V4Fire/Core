"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../core/prelude/extend"));
var _functools = require("../../../core/functools");
var _const = require("../../../core/prelude/types/const");
(0, _extend.default)(Object, 'cast', value => value);
(0, _extend.default)(Object, 'throw', (err = 'This is a loopback function or method') => {
  if (Object.isString(err)) {
    throw new Error(err);
  }
  throw err;
});
(0, _extend.default)(Object, 'isTruly', value => Boolean(value));
(0, _extend.default)(Object, 'isPrimitive', value => !value || !_const.nonPrimitiveTypes[typeof value]);
(0, _extend.default)(Object, 'isUndef', value => value === undefined);
(0, _extend.default)(Object, 'isNull', value => value === null);
(0, _extend.default)(Object, 'isNullable', value => value == null);
(0, _extend.default)(Object, 'isString', value => typeof value === 'string');
(0, _extend.default)(Object, 'isNumber', value => typeof value === 'number');
(0, _extend.default)(Object, 'isBoolean', value => typeof value === 'boolean');
(0, _extend.default)(Object, 'isSymbol', value => typeof value === 'symbol');
(0, _extend.default)(Object, 'isRegExp', value => value instanceof RegExp);
(0, _extend.default)(Object, 'isDate', value => value instanceof Date);
(0, _extend.default)(Object, 'isArray', Array.isArray);
(0, _extend.default)(Object, 'isArrayLike', value => {
  const t = typeof value;
  if (value == null || t !== 'object') {
    return t === 'string';
  }
  return Array.isArray(value) || value.length > 0 && 0 in value || value.length === 0;
});
(0, _extend.default)(Object, 'isMap', value => value instanceof Map);
(0, _extend.default)(Object, 'isWeakMap', value => value instanceof WeakMap);
(0, _extend.default)(Object, 'isSet', value => value instanceof Set);
(0, _extend.default)(Object, 'isWeakSet', value => value instanceof WeakSet);
(0, _extend.default)(Object, 'isDictionary', isPlainObject);
(0, _extend.default)(Object, 'isPlainObject', isPlainObject);
function isPlainObject(value) {
  value = Object.unwrapProxy(value);
  if (!value || typeof value !== 'object') {
    return false;
  }
  const constr = value.constructor;
  return !constr || constr === Object;
}
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
(0, _extend.default)(Object, 'isSimpleObject', value => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  return _const.toString.call(value) === '[object Object]';
});
(0, _extend.default)(Object, 'isFunction', value => typeof value === 'function');
(0, _extend.default)(Object, 'isSimpleFunction', value => typeof value === 'function');
(0, _extend.default)(Object, 'isGenerator', value => typeof value === 'function' && value.constructor.name === 'GeneratorFunction');
(0, _extend.default)(Object, 'isAsyncGenerator', value => typeof value === 'function' && value.constructor.name === 'AsyncGeneratorFunction');
(0, _extend.default)(Object, 'isIterator', value => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  return typeof value.next === 'function';
});
(0, _extend.default)(Object, 'isAsyncIterator', value => Object.isIterator(value) && Object.isAsyncIterable(value));
(0, _extend.default)(Object, 'isIterable', value => {
  if (value == null) {
    return false;
  }
  return Boolean(typeof Symbol === 'function' ? value[Symbol.iterator] : typeof value['@@iterator'] === 'function');
});
(0, _extend.default)(Object, 'isAsyncIterable', value => {
  if (value == null) {
    return false;
  }
  return Boolean(typeof Symbol === 'function' ? value[Symbol.asyncIterator] : typeof value['@@asyncIterator'] === 'function');
});
(0, _extend.default)(Object, 'isPromise', value => {
  if (value) {
    return typeof value.then === 'function' && typeof value.catch === 'function';
  }
  return false;
});
(0, _extend.default)(Object, 'isPromiseLike', value => {
  if (value) {
    return typeof value.then === 'function';
  }
  return false;
});
(0, _extend.default)(Object, 'isProxy', value => value?.[_const.PROXY] != null);
(0, _extend.default)(Object, 'unwrapProxy', value => {
  while (value?.[_const.PROXY] && value[_const.PROXY] !== value) {
    value = value[_const.PROXY];
  }
  return value;
});
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
(0, _extend.default)(Object, 'isObject', (0, _functools.deprecate)({
  name: 'isObject',
  renamedTo: 'isDictionary'
}, isPlainObject));