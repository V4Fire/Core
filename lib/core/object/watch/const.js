"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.watchPath = exports.watchOptions = exports.watchHandlers = exports.toTopObject = exports.toRootObject = exports.toProxyObject = exports.toOriginalObject = exports.muteLabel = exports.blackList = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const toProxyObject = Symbol('Link to a proxy object'),
      toRootObject = Symbol('Link to the root object of watching'),
      toTopObject = Symbol('Link to the top object of watching'),
      toOriginalObject = Symbol('Link to an original object');
exports.toOriginalObject = toOriginalObject;
exports.toTopObject = toTopObject;
exports.toRootObject = toRootObject;
exports.toProxyObject = toProxyObject;
const muteLabel = Symbol('Watcher mute label'),
      watchPath = Symbol('Watch path'),
      watchOptions = Symbol('Watch options'),
      watchHandlers = Symbol('Watch handlers'),
      blackList = Symbol('Black list to watch');
exports.blackList = blackList;
exports.watchHandlers = watchHandlers;
exports.watchOptions = watchOptions;
exports.watchPath = watchPath;
exports.muteLabel = muteLabel;