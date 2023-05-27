"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));
var _structures = require("../../../../core/prelude/structures");
(0, _extend.default)(Function.prototype, 'option', function option() {
  const wrapper = (...args) => {
    const fst = args[0];
    if (fst == null) {
      return _structures.Option.reject(null);
    }
    if (fst instanceof _structures.Option || fst instanceof _structures.Result) {
      return fst.then(value => wrapper(value, ...args.slice(1)));
    }
    try {
      return _structures.Option.resolve(this(...args));
    } catch (err) {
      return _structures.Option.reject(err);
    }
  };
  return wrapper;
});
(0, _extend.default)(Object, 'Option', value => {
  if (value == null) {
    return _structures.Option.reject(null);
  }
  if (Object.isFunction(value)) {
    return value.option();
  }
  return _structures.Option.resolve(value);
});
(0, _extend.default)(Function.prototype, 'result', function result() {
  const wrapper = (...args) => {
    const fst = args[0];
    if (fst instanceof _structures.Option || fst instanceof _structures.Result) {
      return fst.then(value => wrapper(value, ...args.slice(1)));
    }
    try {
      return _structures.Result.resolve(this(...args));
    } catch (err) {
      return _structures.Result.reject(err);
    }
  };
  return wrapper;
});
(0, _extend.default)(Object, 'Result', value => {
  if (value instanceof Error) {
    return _structures.Result.reject(value);
  }
  if (Object.isFunction(value)) {
    return value.result();
  }
  return _structures.Result.resolve(value);
});