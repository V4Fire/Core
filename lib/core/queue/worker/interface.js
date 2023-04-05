"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _simple = _interopRequireDefault(require("../../../core/queue/simple"));
var _interface = _interopRequireWildcard(require("../../../core/queue/interface"));
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
class WorkerQueue extends _interface.default {
  get length() {
    return this.tasks.length;
  }
  activeWorkers = 0;
  constructor(worker, opts = {}) {
    super();
    this.worker = worker;
    this.concurrency = opts.concurrency ?? 1;
    this.refreshInterval = opts.refreshInterval ?? 0;
    if (opts.tasksFactory) {
      this.createTasks = opts.tasksFactory;
    }
    this.tasks = this.createTasks();
  }
  [Symbol.asyncIterator]() {
    const clonedQueue = this.clone();
    return {
      [Symbol.asyncIterator]() {
        return this;
      },
      next() {
        return new Promise(resolve => {
          const done = clonedQueue.length <= 0,
            value = clonedQueue.pop();
          if (done || value == null) {
            return resolve({
              done: true,
              value: undefined
            });
          }
          return resolve({
            done,
            value
          });
        });
      }
    };
  }
  pop() {
    const {
      head
    } = this;
    this.tasks.shift();
    return head;
  }
  clear() {
    if (this.length > 0) {
      this.tasks = this.createTasks();
      this.activeWorkers = 0;
    }
  }
  createTasks = () => new _simple.default();
  deferPerform() {
    const i = this.refreshInterval;
    return new Promise(resolve => {
      const cb = () => resolve(this.perform());
      if (i > 0) {
        setTimeout(cb, i);
      } else {
        cb();
      }
    });
  }
  start() {
    const n = Math.min(this.concurrency - this.activeWorkers, this.length);
    for (let i = 0; i < n; i++) {
      this.activeWorkers++;
      this.perform();
    }
  }
  resolveTask(task, resolve) {
    try {
      resolve(this.worker(task));
    } catch (error) {
      resolve(Promise.reject(error));
    }
  }
}
exports.default = WorkerQueue;