"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  $$: true
};
exports.default = exports.$$ = void 0;
var _eventemitter = require("eventemitter2");
var _symbol = _interopRequireDefault(require("../../../../../core/symbol"));
var _const = require("../../../../../core/cache/decorators/helpers/add-emitter/const");
Object.keys(_const).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _const[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _const[key];
    }
  });
});
var _interface = require("../../../../../core/cache/decorators/helpers/add-emitter/interface");
Object.keys(_interface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface[key];
    }
  });
});
const $$ = (0, _symbol.default)();
exports.$$ = $$;
const addEmitter = cache => {
  const expandedCache = cache;
  const cacheWithEmitter = expandedCache;
  let emitter;
  if (expandedCache[_const.eventEmitter] == null) {
    emitter = new _eventemitter.EventEmitter2({
      maxListeners: 100,
      newListener: false
    });
    expandedCache[_const.eventEmitter] = emitter;
  } else {
    emitter = expandedCache[_const.eventEmitter];
  }
  let originalSet = cacheWithEmitter.set,
    originalRemove = cacheWithEmitter.remove,
    originalClear = cacheWithEmitter.clear;
  if (originalSet[_const.eventEmitter] == null) {
    cacheWithEmitter[$$.set] = originalSet;
    cacheWithEmitter.set = function set(...args) {
      const result = originalSet.call(this, ...args);
      emitter.emit('set', cacheWithEmitter, {
        args,
        result
      });
      return result;
    };
    cacheWithEmitter.set[_const.eventEmitter] = true;
  } else {
    originalSet = cacheWithEmitter[$$.set] ?? originalSet;
  }
  if (originalRemove[_const.eventEmitter] == null) {
    cacheWithEmitter[$$.remove] = originalRemove;
    cacheWithEmitter.remove = function remove(...args) {
      const result = originalRemove.call(this, ...args);
      emitter.emit('remove', cacheWithEmitter, {
        args,
        result
      });
      return result;
    };
    cacheWithEmitter.remove[_const.eventEmitter] = true;
  } else {
    originalRemove = cacheWithEmitter[$$.remove] ?? originalRemove;
  }
  if (originalClear[_const.eventEmitter] == null) {
    cacheWithEmitter[$$.clear] = originalClear;
    cacheWithEmitter.clear = function clear(...args) {
      const result = originalClear.call(this, ...args);
      emitter.emit('clear', cacheWithEmitter, {
        args,
        result
      });
      return result;
    };
    cacheWithEmitter.clear[_const.eventEmitter] = true;
  } else {
    originalClear = cacheWithEmitter[$$.clear] ?? originalClear;
  }
  return {
    set: originalSet.bind(cacheWithEmitter),
    remove: originalRemove.bind(cacheWithEmitter),
    clear: originalClear.bind(cacheWithEmitter),
    subscribe: (method, obj, cb) => {
      emitter.on(method, handler);
      function handler(cacheWithEmitter, e) {
        if (cacheWithEmitter === obj || {}.isPrototypeOf.call(cacheWithEmitter, obj)) {
          cb(e);
        }
      }
    }
  };
};
var _default = addEmitter;
exports.default = _default;