"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;

var _simple = _interopRequireDefault(require("../../../core/queue/simple"));

var _interface = _interopRequireDefault(require("../../../core/queue/interface"));

var _interface2 = require("../../../core/queue/merge/interface");

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
 * [[include:core/queue/merge/README.md]]
 * @packageDocumentation
 */

/**
 * Implementation of a queue data structure with support of task merging by the specified hash function
 * @typeparam T - queue element
 */
class MergeQueue extends _interface.default {
  /**
   * Type: inner queue to store elements
   */

  /** @inheritDoc */
  get head() {
    if (this.length === 0) {
      return undefined;
    }

    return this.tasksMap[this.innerQueue.head];
  }
  /** @inheritDoc */


  get length() {
    return this.innerQueue.length;
  }
  /**
   * Inner queue to store elements
   */


  /**
   * The map of registered tasks
   */
  tasksMap = Object.createDict();
  /**
   * Function to calculate a task hash
   */

  /**
   * @override
   * @param [hashFn]
   */
  constructor(hashFn) {
    super();
    this.innerQueue = this.createInnerQueue();
    this.hashFn = hashFn ?? Object.fastHash.bind(Object);
  }
  /** @inheritDoc */


  push(task) {
    const hash = this.hashFn(task);

    if (this.tasksMap[hash] == null) {
      this.tasksMap[hash] = task;
      this.innerQueue.push(hash);
    }

    return this.length;
  }
  /** @inheritDoc */


  pop() {
    if (this.length === 0) {
      return;
    }

    const {
      head
    } = this;
    delete this.tasksMap[this.innerQueue.head];
    this.innerQueue.shift();
    return head;
  }
  /** @inheritDoc */


  clear() {
    if (this.length > 0) {
      this.innerQueue = this.createInnerQueue();
      this.tasksMap = Object.createDict();
    }
  }
  /**
   * Returns a new blank inner queue to store elements
   */


  createInnerQueue = () => new _simple.default();
}

exports.default = MergeQueue;