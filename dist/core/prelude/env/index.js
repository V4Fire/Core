"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  get: true,
  set: true,
  remove: true
};
exports.get = get;
exports.remove = remove;
exports.set = set;

var _extend = _interopRequireDefault(require("../../../core/prelude/extend"));

var _const = require("../../../core/prelude/env/const");

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

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const memoryStorage = Object.createDict();
let storage; // eslint-disable-next-line prefer-const

storage = Promise.resolve().then(() => _interopRequireWildcard(require('../../../core/kv-storage'))).then(({
  asyncLocal
}) => asyncLocal.namespace('[[ENV]]'));
/**
 * Returns settings from the application environment by the specified key
 * @param key
 */

async function get(key) {
  if (Object.isPromise(storage)) {
    return (await storage).get(key);
  }

  return memoryStorage[key];
}
/**
 * Added settings to the application environment by the specified key
 *
 * @param key
 * @param value
 */


function set(key, value) {
  if (Object.isPromise(storage)) {
    storage.then(storage => storage.set(key, value)).catch(stderr);
  } else {
    memoryStorage[key] = value;
  }

  _const.emitter.emit(`set.${key}`, value);
}
/**
 * Removes settings from the application environment by the specified key
 * @param key
 */


function remove(key) {
  if (Object.isPromise(storage)) {
    storage.then(storage => storage.remove(key)).catch(stderr);
  } else {
    delete memoryStorage[key];
  }

  _const.emitter.emit(`remove.${key}`);
}

(0, _extend.default)(globalThis, 'envs', () => {
  if (Object.isPromise(storage)) {
    return storage.then(storage => {
      console.log(storage);
      return storage;
    });
  }

  console.log(memoryStorage);
  return memoryStorage;
});
(0, _extend.default)(globalThis, 'getEnv', key => get(key).then(val => {
  console.log(val);
  return val;
}));
(0, _extend.default)(globalThis, 'setEnv', set);
(0, _extend.default)(globalThis, 'removeEnv', remove);