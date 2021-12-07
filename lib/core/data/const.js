"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.urlProperties = exports.requestCache = exports.queryMethods = exports.providers = exports.namespace = exports.methodProperties = exports.instanceCache = exports.emitter = exports.connectCache = void 0;

var _eventemitter = require("eventemitter2");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const namespace = Symbol('Provider namespace'),
      providers = Object.createDict();
/**
 * Global event emitter to broadcast provider events
 */

exports.providers = providers;
exports.namespace = namespace;
const emitter = new _eventemitter.EventEmitter2({
  maxListeners: 1e3,
  newListener: false,
  wildcard: true
});
exports.emitter = emitter;
const instanceCache = Object.createDict(),
      requestCache = Object.createDict(),
      connectCache = Object.createDict();
exports.connectCache = connectCache;
exports.requestCache = requestCache;
exports.instanceCache = instanceCache;
const queryMethods = Object.createDict({
  GET: true,
  HEAD: true
});
exports.queryMethods = queryMethods;
const methodProperties = ['getMethod', 'peekMethod', 'addMethod', 'updMethod', 'delMethod'];
exports.methodProperties = methodProperties;
const urlProperties = ['baseURL', 'advURL', 'socketURL', 'baseGetURL', 'basePeekURL', 'baseAddURL', 'baseUpdURL', 'baseDelURL'];
exports.urlProperties = urlProperties;