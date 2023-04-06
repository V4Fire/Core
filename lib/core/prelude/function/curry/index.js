"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));
var _const = require("../../../../core/prelude/function/const");
(0, _extend.default)(Function, '__', {
  get() {
    return _const.__;
  }
});
(0, _extend.default)(Function.prototype, 'curry', function curry() {
  const fn = this;
  return createWrapper(this.length, [], []);
  function createWrapper(length, filteredArgs, gaps) {
    return wrapper;
    function wrapper(...args) {
      const localFilteredArgs = filteredArgs.slice(),
        localGaps = gaps.slice();
      let i = 0;
      if (localGaps.length > 0 && args.length > 0) {
        const tmp = localGaps.slice();
        for (let j = args.length, d = 0; i < tmp.length; i++) {
          if (j-- === 0) {
            break;
          }
          const el = args[i];
          if (el !== _const.__) {
            localFilteredArgs[tmp[i]] = el;
            localGaps.splice(i - d, 1);
            d++;
          }
        }
      }
      for (; i < args.length; i++) {
        const el = args[i];
        if (el === _const.__) {
          localGaps.push(i);
        }
        localFilteredArgs.push(el);
      }
      const newLength = length - args.length + localGaps.length;
      if (newLength <= 0 && localGaps.length === 0) {
        return fn.apply(this, localFilteredArgs);
      }
      return createWrapper(newLength, localFilteredArgs, localGaps);
    }
  }
});
(0, _extend.default)(Function, 'curry', fn => fn.curry());