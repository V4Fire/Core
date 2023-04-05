"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isZombieGroup = exports.isPromisifyNamespace = exports.isPromisifyLinkName = exports.asyncCounter = void 0;
const asyncCounter = Symbol('Async counter id');
exports.asyncCounter = asyncCounter;
const isZombieGroup = /:zombie\b/;
exports.isZombieGroup = isZombieGroup;
const isPromisifyNamespace = /Promise$/,
  isPromisifyLinkName = isPromisifyNamespace;
exports.isPromisifyLinkName = isPromisifyLinkName;
exports.isPromisifyNamespace = isPromisifyNamespace;