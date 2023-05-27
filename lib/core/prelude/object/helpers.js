"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canExtendProto = canExtendProto;
exports.getSameAs = getSameAs;
exports.getType = getType;
exports.isContainer = isContainer;
function isContainer(value) {
  if (!Object.isTruly(value) || typeof value !== 'object') {
    return false;
  }
  if (Object.isArray(value) || Object.isDictionary(value) || Object.isMap(value) || Object.isSet(value)) {
    return true;
  }
  return Object.isCustomObject(value.constructor);
}
function canExtendProto(value) {
  if (!Object.isTruly(value) || typeof value !== 'object') {
    return false;
  }
  if (Object.isArray(value) || Object.isDictionary(value)) {
    return true;
  }
  return Object.isCustomObject(value.constructor);
}
function getType(value) {
  if (value == null || typeof value !== 'object') {
    return '';
  }
  if (Object.isArray(value)) {
    return 'array';
  }
  if (Object.isArrayLike(value)) {
    return 'arrayLike';
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
  return 'object';
}
function getSameAs(value) {
  let res = null;
  if (value != null && typeof value === 'object') {
    if (Object.isArray(value)) {
      res = [];
    } else if (Object.isDictionary(value)) {
      res = Object.getPrototypeOf(value) == null ? Object.create(null) : {};
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