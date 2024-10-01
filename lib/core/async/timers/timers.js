"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _proxy = _interopRequireDefault(require("../../../core/async/proxy"));
var _const = require("../../../core/async/const");
class Async extends _proxy.default {
  setImmediate(cb, opts) {
    return this.registerTask({
      ...opts,
      task: cb,
      namespace: _const.PrimitiveNamespaces.immediate,
      wrapper: setImmediate,
      clear: clearImmediate,
      linkByWrapper: true
    });
  }
  clearImmediate(task) {
    return this.cancelTask(task, _const.PrimitiveNamespaces.immediate);
  }
  muteImmediate(task) {
    return this.markTask('muted', task, _const.PrimitiveNamespaces.immediate);
  }
  unmuteImmediate(p) {
    return this.markTask('!muted', p, _const.PrimitiveNamespaces.immediate);
  }
  suspendImmediate(p) {
    return this.markTask('paused', p, _const.PrimitiveNamespaces.immediate);
  }
  unsuspendImmediate(p) {
    return this.markTask('!paused', p, _const.PrimitiveNamespaces.immediate);
  }
  setInterval(cb, timeout, opts) {
    return this.registerTask({
      ...opts,
      task: cb,
      namespace: _const.PrimitiveNamespaces.interval,
      wrapper: setInterval,
      clear: clearInterval,
      periodic: true,
      linkByWrapper: true,
      args: [timeout]
    });
  }
  clearInterval(task) {
    return this.cancelTask(task, _const.PrimitiveNamespaces.interval);
  }
  muteInterval(task) {
    return this.markTask('muted', task, _const.PrimitiveNamespaces.interval);
  }
  unmuteInterval(task) {
    return this.markTask('!muted', task, _const.PrimitiveNamespaces.interval);
  }
  suspendInterval(task) {
    return this.markTask('paused', task, _const.PrimitiveNamespaces.interval);
  }
  unsuspendInterval(task) {
    return this.markTask('!paused', task, _const.PrimitiveNamespaces.interval);
  }
  setTimeout(cb, timeout, opts) {
    return this.registerTask({
      ...opts,
      task: cb,
      namespace: _const.PrimitiveNamespaces.timeout,
      wrapper: setTimeout,
      clear: clearTimeout,
      linkByWrapper: true,
      args: [timeout]
    });
  }
  clearTimeout(task) {
    return this.cancelTask(task, _const.PrimitiveNamespaces.timeout);
  }
  muteTimeout(task) {
    return this.markTask('muted', task, _const.PrimitiveNamespaces.timeout);
  }
  unmuteTimeout(task) {
    return this.markTask('!muted', task, _const.PrimitiveNamespaces.timeout);
  }
  suspendTimeout(task) {
    return this.markTask('paused', task, _const.PrimitiveNamespaces.timeout);
  }
  unsuspendTimeout(task) {
    return this.markTask('!paused', task, _const.PrimitiveNamespaces.timeout);
  }
}
exports.default = Async;