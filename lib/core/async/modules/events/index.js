"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _sync = _interopRequireDefault(require("../../../../core/promise/sync"));
var _timers = _interopRequireWildcard(require("../../../../core/async/modules/timers"));
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
var _helpers = require("../../../../core/async/modules/events/helpers");
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
var _interface = require("../../../../core/async/interface");
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
    events = Object.isArray(events) ? events : events.split(/\s+/);
    if (p.options) {
      args.unshift(p.options);
      p.options = undefined;
    }
    const that = this,
      links = [],
      multipleEvent = events.length > 1;
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const link = this.registerTask({
        ...p,
        name: this.namespaces.eventListener,
        obj: handler,
        group: p.group ?? event,
        periodic: !p.single,
        linkByWrapper: true,
        clearFn: this.eventListenerDestructor.bind(this),
        wrapper(cb) {
          if (Object.isFunction(emitter)) {
            const originalEmitter = emitter;
            emitter = function wrappedEmitter() {
              const res = originalEmitter.apply(this, arguments);
              if (Object.isFunction(res)) {
                Object.set(wrappedEmitter, 'off', res);
              }
              return res;
            };
          }
          const on = Object.isSimpleFunction(emitter) ? emitter : p.single && emitter.once || emitter.addEventListener || emitter.addListener || emitter.on;
          if (Object.isFunction(on)) {
            on.call(emitter, event, handler, ...args);
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
            if (p.single && (multipleEvent || !emitter.once)) {
              if (multipleEvent) {
                that.clearEventListener(links);
              } else {
                that.eventListenerDestructor({
                  emitter,
                  event,
                  handler,
                  args
                });
              }
            }
            const res = cb.apply(this, handlerArgs);
            if (Object.isPromise(res)) {
              res.catch(stderr);
            }
            return res;
          }
        }
      });
      if (link != null) {
        links.push(link);
      }
    }
    return events.length <= 1 ? links[0] ?? null : links;
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
  promisifyOnce(emitter, events, opts, ...args) {
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
      this.once(emitter, events, handler, {
        ...p,
        promise: true,
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
      for (let i = 0; i < task.length; i++) {
        this.clearEventListener(task[i]);
      }
      return this;
    }
    return this.cancelTask((0, _helpers.isEvent)(task) ? {
      id: task
    } : task, this.namespaces.eventListener);
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
      off = emitter.removeEventListener ?? emitter.removeListener ?? emitter.off;
    if (Object.isFunction(off)) {
      off.call(emitter, event.event, event.handler);
    } else if (!Object.isFunction(emitter)) {
      throw new ReferenceError('A function to remove the event is not defined');
    }
  }
  markEvent(label, task) {
    if (Object.isArray(task)) {
      for (let i = 0; i < task.length; i++) {
        this.markEvent(label, task[i]);
      }
      return this;
    }
    return this.markTask(label, (0, _helpers.isEvent)(task) ? {
      id: task
    } : task, this.namespaces.eventListener);
  }
}
exports.default = Async;