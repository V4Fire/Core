"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.event = exports.emitter = exports.IS_SSR = exports.IS_NODE = exports.HAS_WINDOW = exports.GLOBAL = void 0;
var _eventemitter = require("eventemitter2");
var _const = require("../../../core/prelude/types/const");
const emitter = new _eventemitter.EventEmitter2({
  maxListeners: 100,
  newListener: false
});
exports.emitter = emitter;
const event = emitter;
exports.event = event;
const GLOBAL = typeof globalThis === 'object' && isGlobal(globalThis) && globalThis || typeof window === 'object' && isGlobal(window) && window || typeof global === 'object' && isGlobal(global) && global || typeof self === 'object' && isGlobal(self) && self || function getGlobalUnstrict() {
  return this;
}() || new Function('', 'return this')();
exports.GLOBAL = GLOBAL;
if (typeof globalThis === 'undefined') {
  GLOBAL.globalThis = GLOBAL;
}
const IS_SSR = Boolean(typeof SSR !== 'undefined' && SSR);
exports.IS_SSR = IS_SSR;
const HAS_WINDOW = typeof window === 'object';
exports.HAS_WINDOW = HAS_WINDOW;
const IS_NODE = (() => {
  try {
    const process = globalThis['process'];
    return typeof process === 'object' && _const.toString.call(process) === '[object process]';
  } catch {
    return false;
  }
})();
exports.IS_NODE = IS_NODE;
function isGlobal(obj) {
  return Boolean(obj) && obj.Math === Math;
}