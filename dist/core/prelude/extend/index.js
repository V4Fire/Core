"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extend;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Extends an object or function by the specified method
 *
 * @param obj
 * @param name - method name
 * @param method
 */
function extend(obj, name, method) {
  const descriptor = {
    configurable: true
  };

  if (typeof method === 'function') {
    descriptor.writable = true;
    descriptor.value = method;
  } else {
    Object.assign(descriptor, method);
  }

  const dictKey = Symbol.for('[[V4_EXTEND_API]]');

  if (!(dictKey in obj)) {
    Object.defineProperty(obj, dictKey, {
      value: Object.create(null)
    });
  }

  Object.defineProperty(obj[dictKey], name, descriptor);
  Object.defineProperty(obj, name, descriptor);
}