"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigurableMiddleware = void 0;
var env = _interopRequireWildcard(require("../../../core/env"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
let logOps;
const setConfig = opts => {
  const p = {
    patterns: [':error\\b'],
    ...opts
  };
  logOps = p;
  if (logOps == null) {
    return;
  }
  p.patterns = (p.patterns ?? []).map(el => Object.isRegExp(el) ? el : new RegExp(el));
};
env.get('log').then(setConfig, setConfig);
env.emitter.on('set.log', setConfig);
env.emitter.on('remove.log', setConfig);
class ConfigurableMiddleware {
  queue = [];
  exec(events, next) {
    if (logOps == null) {
      if (Array.isArray(events)) {
        this.queue.push(...events);
      } else {
        this.queue.push(events);
      }
      return;
    }
    if (this.queue.length > 0) {
      const queuedEvents = [];
      for (let o = this.queue, i = 0; i < o.length; i++) {
        const el = o[i];
        if (this.filterContext(el.context)) {
          queuedEvents.push(el);
        }
      }
      if (queuedEvents.length > 0) {
        next(queuedEvents);
      }
      this.queue = [];
    }
    if (Array.isArray(events)) {
      const filteredEvents = [];
      for (let o = events, i = 0; i < o.length; i++) {
        const el = o[i];
        if (this.filterContext(el.context)) {
          filteredEvents.push(el);
        }
      }
      if (filteredEvents.length > 0) {
        next(filteredEvents);
      }
    } else if (this.filterContext(events.context)) {
      next(events);
    }
  }
  filterContext(context) {
    if (logOps?.patterns) {
      for (let {
          patterns
        } = logOps, i = 0; i < patterns.length; i++) {
        if (patterns[i].test(context)) {
          return true;
        }
      }
      return false;
    }
    return true;
  }
}
exports.ConfigurableMiddleware = ConfigurableMiddleware;