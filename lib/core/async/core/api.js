"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _core = _interopRequireDefault(require("../../../core/async/core/core"));
var _const = require("../../../core/async/core/const");
class Async extends _core.default {
  clearAll(opts) {
    this.usedNamespaces.forEach((used, i) => {
      if (!used) {
        return;
      }
      const key = this.Namespaces[i],
        alias = `clear-${key}`.camelize(false);
      if (Object.isFunction(this[alias])) {
        this[alias](opts);
      } else if (!_const.isPromisifyNamespace.test(i)) {
        throw new ReferenceError(`The method "${alias}" is not defined`);
      }
    });
    return this;
  }
  muteAll(opts) {
    this.usedNamespaces.forEach((used, i) => {
      if (!used) {
        return;
      }
      const key = this.Namespaces[i],
        alias = `mute-${key}`.camelize(false);
      if (!_const.isPromisifyNamespace.test(i) && Object.isFunction(this[alias])) {
        this[alias](opts);
      }
    });
    return this;
  }
  unmuteAll(opts) {
    this.usedNamespaces.forEach((used, i) => {
      if (!used) {
        return;
      }
      const key = this.Namespaces[i],
        alias = `unmute-${key}`.camelize(false);
      if (!_const.isPromisifyNamespace.test(i) && Object.isFunction(this[alias])) {
        this[alias](opts);
      }
    });
    return this;
  }
  suspendAll(opts) {
    this.usedNamespaces.forEach((used, i) => {
      if (!used) {
        return;
      }
      const key = this.Namespaces[i],
        alias = `suspend-${key}`.camelize(false);
      if (!_const.isPromisifyNamespace.test(i) && Object.isFunction(this[alias])) {
        this[alias](opts);
      }
    });
    return this;
  }
  unsuspendAll(opts) {
    this.usedNamespaces.forEach((used, i) => {
      if (!used) {
        return;
      }
      const key = this.Namespaces[i],
        alias = `unsuspend-${key}`.camelize(false);
      if (!_const.isPromisifyNamespace.test(i) && Object.isFunction(this[alias])) {
        this[alias](opts);
      }
    });
    return this;
  }
}
exports.default = Async;