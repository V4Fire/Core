"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.event = exports.emitter = exports.IS_NODE = exports.HAS_WINDOW = exports.GLOBAL = void 0;

var _eventemitter = require("eventemitter2");

var _const = require("../../../core/prelude/types/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Event emitter to broadcast environment events
 */
const emitter = new _eventemitter.EventEmitter2({
  maxListeners: 100,
  newListener: false
});
/**
 * @deprecated
 * @see [[emitter]]
 */

exports.emitter = emitter;
const event = emitter;
/**
 * Link to the global object
 */

exports.event = event;
const // eslint-disable-next-line no-new-func
GLOBAL = Function('return this')();
exports.GLOBAL = GLOBAL;

if (typeof globalThis === 'undefined') {
  GLOBAL.globalThis = GLOBAL;
}
/**
 * True if the current runtime has window object
 */
// eslint-disable-next-line no-restricted-globals


const HAS_WINDOW = typeof window === 'object';
/**
 * True if the current runtime is looks like Node.js
 */

exports.HAS_WINDOW = HAS_WINDOW;

const IS_NODE = (() => {
  try {
    // eslint-disable-next-line prefer-destructuring
    const process = globalThis['process'];
    return typeof process === 'object' && _const.toString.call(process) === '[object process]';
  } catch {
    return false;
  }
})();

exports.IS_NODE = IS_NODE;