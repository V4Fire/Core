"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canExtendProto = canExtendProto;
exports.getSameAs = getSameAs;
exports.getType = getType;
exports.isContainer = isContainer;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Returns true if the specified value is a container structure
 * @param value
 */
function isContainer(value) {
  if (!Object.isTruly(value) || typeof value !== 'object') {
    return false;
  }

  if (Object.isArray(value) || Object.isDictionary(value) || Object.isMap(value) || Object.isSet(value)) {
    return true;
  }

  return Object.isCustomObject(value.constructor);
}
/**
 * Returns true if the specified value has a prototype that can be extended
 * @param value
 */


function canExtendProto(value) {
  if (!Object.isTruly(value) || typeof value !== 'object') {
    return false;
  }

  if (Object.isArray(value) || Object.isDictionary(value)) {
    return true;
  }

  return Object.isCustomObject(value.constructor);
}
/**
 * Returns a type of the specified value
 * @param value
 */


function getType(value) {
  if (!Object.isTruly(value) || typeof value !== 'object') {
    return '';
  }

  if (Object.isMap(value)) {
    return 'map';
  }

  if (Object.isWeakMap(value)) {
    return 'weakMap';
  }

  if (Object.isSet(value)) {
    return 'set';
  }

  if (Object.isWeakSet(value)) {
    return 'weakSet';
  }

  if (Object.isGenerator(value)) {
    return 'generator';
  }

  if (Object.isArrayLike(value)) {
    return 'array';
  }

  if (Object.isIterator(value) || Object.isIterable(value)) {
    return 'iterator';
  }

  return 'object';
}
/**
 * Returns a new instance of the specified value or null
 * @param value
 */


function getSameAs(value) {
  let res = null;

  if (value != null && typeof value === 'object') {
    if (Object.isArray(value)) {
      res = [];
    } else if (Object.isDictionary(value)) {
      res = Object.create(Object.getPrototypeOf(value));
    } else if (Object.isMap(value)) {
      res = new Map();
    } else if (Object.isSet(value)) {
      res = new Set();
    } else if (Object.isCustomObject(Object.cast(value).constructor)) {
      res = {};
    }
  }

  return Object.cast(res);
}