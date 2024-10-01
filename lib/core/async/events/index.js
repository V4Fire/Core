"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _sync = _interopRequireDefault(require("../../../core/promise/sync"));
var _timers = _interopRequireWildcard(require("../../../core/async/timers"));
Object.keys(_timers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _timers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _timers[key];
    }
  });
});
var _const = require("../../../core/async/const");
var _helpers = require("../../../core/async/events/helpers");
Object.keys(_helpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _helpers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _helpers[key];
    }
  });
});
var _interface = require("../../../core/async/interface");
Object.keys(_interface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface[key];
    }
  });
});
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const OFF = Symbol('off');
class Async extends _timers.default {
  on(emitter, events, handler, opts, ...args) {
    let p;
    if (Object.isArray(opts)) {
      args.unshift(opts);
      p = {};
    } else {
      p = opts ?? {};
    }
    p = {
      ...p
    };
    if (Object.isString(events)) {
      events = events.includes(' ') ? events.split(/\s+/) : [events];
    }
    if (events.length === 0) {
      return null;
    }
    if (p.options) {
      args.unshift(p.options);
      p.options = undefined;
    }
    const that = this,
      originalEmitter = emitter;
    const ids = new Array(events.length),
      hasMultipleEvent = events.length > 1;
    events.forEach((event, i) => {
      let emitter = originalEmitter;
      const id = this.registerTask({
        ...p,
        task: handler,
        namespace: _const.PrimitiveNamespaces.eventListener,
        group: p.group ?? event,
        periodic: !p.single,
        linkByWrapper: true,
        clear: this.eventListenerDestructor.bind(this),
        wrapper(cb) {
          if (Object.isFunction(originalEmitter)) {
            emitter = function wrappedEmitter() {
              const destructor = originalEmitter.apply(this, arguments);
              if (Object.isFunction(destructor)) {
                Object.defineProperty(wrappedEmitter, OFF, {
                  value: destructor
                });
              }
              return destructor;
            };
          }
          const on = Object.isSimpleFunction(emitter) ? emitter : p.single && emitter.once || emitter.on || emitter.addListener || emitter.addEventListener;
          if (Object.isFunction(on)) {
            switch (args.length) {
              case 0:
                on.call(emitter, event, handler);
                break;
              default:
                on.call(emitter, event, handler, ...args);
            }
          } else {
            throw new ReferenceError('A method to attach events is not defined');
          }
          return {
            event,
            emitter,
            handler,
            args
          };
          function handler(...handlerArgs) {
            if (p.single && (hasMultipleEvent || !emitter.once)) {
              if (hasMultipleEvent) {
                that.clearEventListener(ids);
              } else {
                that.eventListenerDestructor({
                  emitter,
                  event,
                  handler,
                  args
                });
              }
            }
            let cbRes;
            switch (handlerArgs.length) {
              case 0:
                cbRes = cb.call(this);
                break;
              case 1:
                cbRes = cb.call(this, handlerArgs[0]);
                break;
              case 2:
                cbRes = cb.call(this, handlerArgs[0], handlerArgs[1]);
                break;
              default:
                cbRes = cb.apply(this, handlerArgs);
            }
            if (Object.isPromise(cbRes)) {
              cbRes.catch(stderr);
            }
            return cbRes;
          }
        }
      });
      if (id != null) {
        ids[i] = id;
      }
    });
    return hasMultipleEvent ? ids : ids[0] ?? null;
  }
  once(emitter, events, handler, opts, ...args) {
    let p;
    if (Object.isArray(opts)) {
      args.unshift(opts);
      p = {};
    } else {
      p = opts ?? {};
    }
    return this.on(emitter, events, handler, {
      ...p,
      single: true
    }, ...args);
  }
  promisifyOnce(emitter, event, opts, ...args) {
    let p;
    if (Object.isArray(opts)) {
      args.unshift(opts);
      p = {};
    } else {
      p = opts ?? {};
    }
    return new _sync.default((resolve, reject) => {
      const handler = e => {
        if (Object.isFunction(p.handler)) {
          return resolve(p.handler.call(this.ctx, e));
        }
        resolve(e);
      };
      this.once(emitter, [event], handler, {
        ...p,
        promise: _const.PromiseNamespaces.eventListenerPromise,
        onClear: this.onPromiseClear(handler, reject),
        onMerge: this.onPromiseMerge(handler, reject)
      }, ...args);
    });
  }
  off(task) {
    return this.clearEventListener(Object.cast(task));
  }
  clearEventListener(task) {
    if (Object.isArray(task)) {
      task.forEach(task => {
        this.clearEventListener(task);
      });
      return this;
    }
    return this.cancelTask((0, _helpers.isEvent)(task) ? {
      id: task
    } : task, _const.PrimitiveNamespaces.eventListener);
  }
  muteEventListener(task) {
    return this.markEvent('muted', Object.cast(task));
  }
  unmuteEventListener(task) {
    return this.markEvent('!muted', Object.cast(task));
  }
  suspendEventListener(task) {
    return this.markEvent('paused', Object.cast(task));
  }
  unsuspendEventListener(p) {
    return this.markEvent('!paused', Object.cast(p));
  }
  eventListenerDestructor(event) {
    const emitter = event.emitter,
      off = emitter[OFF] ?? emitter.off ?? emitter.removeListener ?? emitter.removeEventListener;
    if (Object.isFunction(off)) {
      off.call(emitter, event.event, event.handler);
    } else if (!Object.isFunction(emitter)) {
      throw new ReferenceError('A function to remove the event is not defined');
    }
  }
  markEvent(marker, task) {
    if (Object.isArray(task)) {
      task.forEach(task => {
        this.markEvent(marker, task);
      });
      return this;
    }
    return this.markTask(marker, (0, _helpers.isEvent)(task) ? {
      id: task
    } : task, _const.PrimitiveNamespaces.eventListener);
  }
}
exports.default = Async;