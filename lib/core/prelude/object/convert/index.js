"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));
var _const = require("../../../../core/prelude/object/const");
(0, _extend.default)(Object, 'trySerialize', (value, replacer) => {
  if (Object.isFunction(value)) {
    replacer = value;
    return value => Object.trySerialize(value, replacer);
  }
  let encodedValue;
  const canSerializeToJSON = Object.isString(value) || Object.isArray(value) || Object.isDictionary(value) || Object.isFunction(Object.get(value, 'toJSON'));
  if (canSerializeToJSON) {
    try {
      encodedValue = JSON.stringify(value, replacer);
    } catch {
      encodedValue = value;
    }
  } else {
    encodedValue = value;
    try {
      if (Object.isFunction(replacer)) {
        return Object.trySerialize(replacer('', encodedValue), replacer);
      }
    } catch {}
  }
  return encodedValue;
});
(0, _extend.default)(Object, 'parse', (value, reviver) => {
  if (Object.isFunction(value)) {
    reviver = value;
    return value => Object.parse(value, wrapReviver(reviver));
  }
  if (Object.isString(value)) {
    if (value === 'undefined') {
      return;
    }
    if (_const.canParse.test(value)) {
      try {
        const parsedVal = JSON.parse(value, wrapReviver(reviver));
        if (Object.isNumber(parsedVal)) {
          return parsedVal.isSafe() ? parsedVal : value;
        }
        return parsedVal;
      } catch {}
    }
    if (Object.isFunction(reviver)) {
      return reviver('', value);
    }
  }
  return value;
  function wrapReviver(fn) {
    return (key, value) => {
      if (_const.isInvalidKey.test(key)) {
        return;
      }
      if (Object.isFunction(fn)) {
        value = fn(key, value);
      }
      return value;
    };
  }
});