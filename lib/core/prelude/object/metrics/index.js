"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));
(0, _extend.default)(Object, 'size', obj => {
  if (!Object.isTruly(obj)) {
    return 0;
  }
  if (Object.isArray(obj) || Object.isString(obj) || Object.isFunction(obj)) {
    return obj.length;
  }
  if (Object.isNumber(obj)) {
    return isNaN(obj) ? 0 : obj;
  }
  if (typeof obj !== 'object') {
    return 0;
  }
  if (Object.isMap(obj) || Object.isSet(obj)) {
    return obj.size;
  }
  let length = 0;
  if (Object.isIterable(obj)) {
    for (const _ of obj) {
      length++;
    }
    return length;
  }
  if (Object.isDictionary(obj)) {
    return Object.keys(obj).length;
  }
  return 0;
});