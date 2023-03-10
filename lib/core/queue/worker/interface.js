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

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * An abstract class for a worker queue data structure
 *
 * @typeparam T - the task element
 * @typeparam V - the worker value
 */
class WorkerQueue extends _interface.default {
  /**
   * Type: a queue of tasks
   */

  /** @inheritDoc */
  get length() {
    return this.tasks.length;
  }
  /**
   * The maximum number of concurrent workers
   */


  /**
   * Number of active workers
   */
  activeWorkers = 0;
  /**
   * The worker constructor
   */

  /**
   * @param worker
   * @param [opts] - additional options
   */
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
  /** @inheritDoc */


  /**
   * Returns an asynchronous iterator over the queue elements
   */
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
  /** @inheritDoc */


  pop() {
    const {
      head
    } = this;
    this.tasks.shift();
    return head;
  }
  /** @inheritDoc */


  clear() {
    if (this.length > 0) {
      this.tasks = this.createTasks();
      this.activeWorkers = 0;
    }
  }
  /**
   * Returns a new blank internal queue of tasks
   */


  createTasks = () => new _simple.default();
  /**
   * Executes a task chunk from the queue
   */

  /**
   * Executes a task chunk from the queue (deferred version)
   */
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
  /**
   * Starts an execution of tasks from the queue
   */


  start() {
    const n = Math.min(this.concurrency - this.activeWorkers, this.length);

    for (let i = 0; i < n; i++) {
      this.activeWorkers++;
      this.perform();
    }
  }
  /**
   * Provides a task result to the specified promise resolve function
   *
   * @param task
   * @param resolve
   */


  resolveTask(task, resolve) {
    try {
      resolve(this.worker(task));
    } catch (error) {
      resolve(Promise.reject(error));
    }
  }

}

exports.default = WorkerQueue;