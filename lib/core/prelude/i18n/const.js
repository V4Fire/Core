"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.locale = exports.event = exports.emitter = void 0;

var _eventemitter = require("eventemitter2");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Event emitter to broadcast localization events
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
 * System language
 */

exports.event = event;
const locale = {
  value: '',
  isDefined: false,
  isInitialized: Promise.resolve()
};
exports.locale = locale;