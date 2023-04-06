"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.watchPath = exports.watchOptions = exports.watchHandlers = exports.toTopObject = exports.toRootObject = exports.toProxyObject = exports.toOriginalObject = exports.muteLabel = exports.blackList = void 0;
var _const = require("../../../core/prelude/types/const");
const toProxyObject = Symbol('Link to a proxy object'),
  toRootObject = Symbol('Link to the root object of watching'),
  toTopObject = Symbol('Link to the top object of watching'),
  toOriginalObject = _const.PROXY;
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