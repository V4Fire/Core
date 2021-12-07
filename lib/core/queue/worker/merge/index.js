"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;

var _interface = _interopRequireDefault(require("../../../../core/queue/worker/interface"));

var _interface2 = require("../../../../core/queue/worker/merge/interface");

Object.keys(_interface2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface2[key];
    }
  });
});

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/queue/worker/merge/README.md]]
 * @packageDocumentation
 */

/**
 * Implementation of a worker queue data structure with support of task merging by the specified hash function
 *
 * @typeparam T - task element
 * @typeparam V - worker value
 */
class MergeWorkerQueue extends _interface.default {
  get head() {
    if (this.length === 0) {
      return undefined;
    }

    const obj = this.tasksMap[this.tasks.head];
    return obj?.task;
  }
  /**
   * The map of registered tasks
   */


  tasksMap = Object.createDict();
  /**
   * Function to calculate a task hash
   */

  /**
   * @override
   * @param worker
   * @param [opts]
   */
  constructor(worker, opts) {
    super(worker, opts);
    this.hashFn = opts.hashFn ?? Object.fastHash.bind(Object);
  }

  push(task) {
    const hash = this.hashFn(task);
    let taskObj = this.tasksMap[hash];

    if (taskObj == null) {
      let resolve;
      const promise = new Promise(r => {
        resolve = r;
      });
      taskObj = {
        task,
        promise,
        resolve
      };
      this.tasksMap[hash] = taskObj;
      this.tasks.push(hash);
    }

    this.start();
    return taskObj.promise;
  }

  pop() {
    if (this.length === 0) {
      return;
    }

    const {
      head
    } = this;
    delete this.tasksMap[this.tasks.head];
    this.tasks.shift();
    return head;
  }

  clear() {
    if (this.length > 0) {
      super.clear();
      this.tasksMap = Object.createDict();
    }
  }

  perform() {
    if (this.length === 0) {
      this.activeWorkers--;
      return;
    }

    const hash = this.tasks.shift();

    if (hash === undefined) {
      return;
    }

    const taskObj = this.tasksMap[hash];

    if (!taskObj) {
      return;
    }

    const // eslint-disable-next-line @typescript-eslint/unbound-method
    {
      task,
      promise,
      resolve
    } = taskObj;

    const cb = () => {
      delete this.tasksMap[hash];
      return this.deferPerform();
    };

    promise.then(cb, cb);
    this.resolveTask(task, resolve);
  }

}

exports.default = MergeWorkerQueue;