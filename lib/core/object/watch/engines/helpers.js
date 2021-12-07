"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOrCreateLabelValueByHandlers = getOrCreateLabelValueByHandlers;
exports.getProxyType = getProxyType;
exports.getProxyValue = getProxyValue;
exports.isProxy = isProxy;
exports.unwrap = unwrap;

var _engines = _interopRequireDefault(require("../../../../core/object/watch/engines"));

var _const = require("../../../../core/object/watch/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Returns true if the specified value is a watch proxy
 * @param value
 */
function isProxy(value) {
  if (value == null || typeof value !== 'object') {
    return false;
  }

  return _const.toOriginalObject in value;
}
/**
 * Unwraps the specified value to watch and returns the raw object
 * @param value
 */


function unwrap(value) {
  value = value != null && typeof value === 'object' && value[_const.toOriginalObject] || value;
  return value != null && typeof value === 'object' && !Object.isFrozen(value) ? value : undefined;
}
/**
 * Returns a type of data to watch or false
 * @param obj
 */


function getProxyType(obj) {
  if (Object.isDictionary(obj)) {
    return 'dictionary';
  }

  if (Object.isArray(obj)) {
    return 'array';
  }

  if (Object.isMap(obj) || Object.isWeakMap(obj)) {
    return 'map';
  }

  if (Object.isSet(obj) || Object.isWeakSet(obj)) {
    return 'set';
  }

  return null;
}
/**
 * Returns a value to the proxy from the specified raw value
 *
 * @param rawValue
 * @param key - property key for a value
 * @param path - base path to object properties: it is provided to a watch handler with parameters
 * @param handlers - set of registered handlers
 * @param root - link to the root object of watching
 * @param [top] - link to the top object of watching
 * @param [opts] - additional options
 */


function getProxyValue(rawValue, key, path, handlers, root, top, opts) {
  if (opts == null) {
    return rawValue;
  }

  if (Object.isTruly(opts.fromProto) && !opts.withProto) {
    return rawValue;
  }

  if (opts.deep && getProxyType(rawValue) != null) {
    const fullPath = Array.concat([], path ?? [], key),
          obj = rawValue;
    return (opts.engine ?? _engines.default).watch(obj, fullPath, null, handlers, opts, root, top ?? obj);
  }

  return rawValue;
}
/**
 * Returns a value from an object by the specified label and handlers
 *
 * @param obj
 * @param label
 * @param handlers
 */


function getOrCreateLabelValueByHandlers(obj, label, handlers, def) {
  let box = Object.hasOwnProperty(obj, label) ? obj[label] : null;

  if (box == null) {
    box = new WeakMap();
    Object.defineProperty(obj, label, {
      configurable: true,
      value: box
    });
  }

  let val = box.get(handlers);

  if (val === undefined && def !== undefined) {
    val = Object.isFunction(def) ? def() : def;
    box.set(handlers, val);
  }

  return val;
}