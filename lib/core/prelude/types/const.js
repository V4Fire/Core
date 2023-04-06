"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toString = exports.nonPrimitiveTypes = exports.isNative = exports.READONLY = exports.PROXY = void 0;
const READONLY = Symbol('Is readonly'),
  PROXY = Symbol('Link to a proxied original object');
exports.PROXY = PROXY;
exports.READONLY = READONLY;
const isNative = /\[native code]/,
  nonPrimitiveTypes = {
    object: true,
    function: true
  };
exports.nonPrimitiveTypes = nonPrimitiveTypes;
exports.isNative = isNative;
const {
  toString
} = Object.prototype;
exports.toString = toString;