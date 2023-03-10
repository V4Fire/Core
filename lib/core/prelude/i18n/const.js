"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluralizeMap = exports.locale = exports.event = exports.emitter = void 0;

var _eventemitter = require("eventemitter2");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * The event emitter to broadcast localization events
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
 * The default application language
 */

exports.event = event;
const locale = {
  value: undefined,
  isDefault: false
};
/**
 * A dictionary to map literal pluralization forms to numbers
 */

exports.locale = locale;
const pluralizeMap = Object.createDict({
  none: 0,
  one: 1,
  some: 2,
  many: 5
});
exports.pluralizeMap = pluralizeMap;