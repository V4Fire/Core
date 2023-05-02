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
class MergeWorkerQueue extends _interface.default {
  get head() {
    if (this.length === 0) {
      return undefined;
    }
    const obj = this.tasksMap.get(this.tasks.head);
    return obj?.task;
  }
  tasksMap = new Map();
  constructor(worker, opts) {
    super(worker, opts);
    this.hashFn = opts.hashFn ?? Object.fastHash.bind(Object);
  }
  push(task) {
    const hash = this.hashFn(task);
    let taskObj = this.tasksMap.get(hash);
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
      this.tasksMap.set(hash, taskObj);
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
    this.tasksMap.delete(this.tasks.head);
    this.tasks.shift();
    return head;
  }
  clear() {
    if (this.length > 0) {
      super.clear();
      this.tasksMap = new Map();
    }
  }
  clone() {
    const newQueue = new MergeWorkerQueue(this.worker, {});
    Object.assign(newQueue, this);
    newQueue.tasksMap = new Map(this.tasksMap);
    if (this.tasks.clone != null) {
      newQueue.tasks = this.tasks.clone();
    } else {
      const tasks = this.createTasks();
      for (const task of this.tasks) {
        tasks.push(task);
      }
      newQueue.tasks = tasks;
    }
    return newQueue;
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
    const taskObj = this.tasksMap.get(hash);
    if (taskObj == null) {
      return;
    }
    const {
      task,
      promise,
      resolve
    } = taskObj;
    const cb = () => {
      this.tasksMap.delete(hash);
      return this.deferPerform();
    };
    promise.then(cb, cb);
    this.resolveTask(task, resolve);
  }
}
exports.default = MergeWorkerQueue;