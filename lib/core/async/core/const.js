"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isZombieGroup = exports.isPromisifyNamespace = exports.asyncCounter = void 0;
var _const = require("../../../core/async/const");
const asyncCounter = Symbol('Async counter id');
exports.asyncCounter = asyncCounter;
const isZombieGroup = {
  test(group) {
    return group.includes(':zombie');
  }
};
exports.isZombieGroup = isZombieGroup;
const isPromisifyNamespace = {
  test(namespace) {
    return namespace > _const.PromiseNamespaces.first;
  }
};
exports.isPromisifyNamespace = isPromisifyNamespace;