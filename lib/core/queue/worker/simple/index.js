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
 * [[include:core/queue/worker/simple/README.md]]
 * @packageDocumentation
 */

/**
 * Implementation of a worker queue data structure
 *
 * @typeparam T - task element
 * @typeparam V - worker value
 */
class SimpleWorkerQueue extends _interface.default {
  get head() {
    return this.tasks.head?.task;
  }

  push(task) {
    let resolve;
    const promise = new Promise(r => {
      resolve = r;
    });
    const taskObj = {
      task,
      promise,
      resolve
    };
    this.tasks.push(taskObj);
    this.start();
    return taskObj.promise;
  }

  perform() {
    if (this.length === 0) {
      this.activeWorkers--;
      return;
    }

    const taskObj = this.tasks.shift();

    if (!taskObj) {
      return;
    }

    const // eslint-disable-next-line @typescript-eslint/unbound-method
    {
      task,
      promise,
      resolve
    } = taskObj;
    const cb = this.deferPerform.bind(this);
    promise.then(cb, cb);
    this.resolveTask(task, resolve);
  }

}

exports.default = SimpleWorkerQueue;