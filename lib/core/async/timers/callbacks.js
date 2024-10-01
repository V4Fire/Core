"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _timers = _interopRequireDefault(require("../../../core/async/timers/timers"));
var _const = require("../../../core/async/const");
class Async extends _timers.default {
  requestIdleCallback(cb, opts) {
    let wrapper, clear;
    if (typeof requestIdleCallback !== 'function') {
      wrapper = fn => setTimeout(() => fn({
        timeRemaining: () => 0,
        didTimeout: true
      }), 50);
      clear = clearTimeout;
    } else {
      wrapper = requestIdleCallback;
      clear = cancelIdleCallback;
    }
    return this.registerTask({
      ...(opts && Object.reject(opts, 'timeout')),
      task: cb,
      namespace: _const.PrimitiveNamespaces.idleCallback,
      wrapper,
      clear,
      linkByWrapper: true,
      args: opts != null ? {
        timeout: opts.timeout
      } : undefined
    });
  }
  cancelIdleCallback(task) {
    return this.clearIdleCallback(Object.cast(task));
  }
  clearIdleCallback(task) {
    return this.cancelTask(task, _const.PrimitiveNamespaces.idleCallback);
  }
  muteIdleCallback(task) {
    return this.markTask('muted', task, _const.PrimitiveNamespaces.idleCallback);
  }
  unmuteIdleCallback(task) {
    return this.markTask('!muted', task, _const.PrimitiveNamespaces.idleCallback);
  }
  suspendIdleCallback(task) {
    return this.markTask('paused', task, _const.PrimitiveNamespaces.idleCallback);
  }
  unsuspendIdleCallback(task) {
    return this.markTask('!paused', task, _const.PrimitiveNamespaces.idleCallback);
  }
  requestAnimationFrame(cb, p) {
    if (Object.isDictionary(p)) {
      return this.registerTask({
        ...p,
        task: cb,
        namespace: _const.PrimitiveNamespaces.animationFrame,
        wrapper: requestAnimationFrame,
        clear: cancelAnimationFrame,
        linkByWrapper: true,
        args: p.element
      });
    }
    return this.registerTask({
      task: cb,
      namespace: _const.PrimitiveNamespaces.animationFrame,
      wrapper: requestAnimationFrame,
      clear: cancelAnimationFrame,
      linkByWrapper: true,
      args: p
    });
  }
  cancelAnimationFrame(task) {
    return this.clearAnimationFrame(Object.cast(task));
  }
  clearAnimationFrame(task) {
    return this.cancelTask(task, _const.PrimitiveNamespaces.animationFrame);
  }
  muteAnimationFrame(task) {
    return this.markTask('muted', task, _const.PrimitiveNamespaces.animationFrame);
  }
  unmuteAnimationFrame(task) {
    return this.markTask('!muted', task, _const.PrimitiveNamespaces.animationFrame);
  }
  suspendAnimationFrame(task) {
    return this.markTask('paused', task, _const.PrimitiveNamespaces.animationFrame);
  }
  unsuspendAnimationFrame(task) {
    return this.markTask('!paused', task, _const.PrimitiveNamespaces.animationFrame);
  }
}
exports.default = Async;