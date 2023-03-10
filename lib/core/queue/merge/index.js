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
 * Implementation of a queue data structure with support of task merging by a specified hash function
 * @typeparam T - the queue element
 */
class MergeQueue extends _interface.default {
  /**
   * Type: the internal queue to store elements
   */

  /** @inheritDoc */
  get head() {
    if (this.length === 0) {
      return undefined;
    }

    return this.tasksMap.get(this.innerQueue.head);
  }
  /** @inheritDoc */


  get length() {
    return this.innerQueue.length;
  }
  /**
   * The internal queue to store elements
   */


  /**
   * A map of registered tasks
   */
  tasksMap = new Map();
  /**
   * A function to calculate task hashes
   */

  /**
   * @override
   * @param [hashFn] - a function to calculate task hashes
   */
  constructor(hashFn) {
    super();
    this.innerQueue = this.createInnerQueue();
    this.hashFn = hashFn ?? Object.fastHash.bind(Object);
  }
  /** @inheritDoc */


  push(task) {
    const hash = this.hashFn(task);

    if (!this.tasksMap.has(hash)) {
      this.tasksMap.set(hash, task);
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
    this.tasksMap.delete(this.innerQueue.head);
    this.innerQueue.shift();
    return head;
  }
  /** @inheritDoc */


  clear() {
    if (this.length > 0) {
      this.innerQueue = this.createInnerQueue();
      this.tasksMap = new Map();
    }
  }
  /** @inheritDoc */


  clone() {
    const newQueue = new MergeQueue(this.hashFn);
    newQueue.tasksMap = new Map(this.tasksMap);

    if (this.innerQueue.clone != null) {
      newQueue.innerQueue = this.innerQueue.clone();
    } else {
      for (const el of this.innerQueue) {
        newQueue.innerQueue.push(el);
      }
    }

    return newQueue;
  }
  /**
   * Returns a new blank internal queue to store elements
   */


  createInnerQueue = () => new _simple.default();
}

exports.default = MergeQueue;