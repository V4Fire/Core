"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;

var _interface = _interopRequireDefault(require("../../../core/queue/interface"));

var _interface2 = require("../../../core/queue/order/interface");

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
 * [[include:core/queue/order/README.md]]
 * @packageDocumentation
 */

/**
 * Implementation of an ordered queue data structure
 * @typeparam T - queue element
 */
class OrderedQueue extends _interface.default {
  /**
   * Type: inner queue to store elements
   */

  /** @inheritDoc */
  get head() {
    return this.innerQueue[0];
  }
  /** @inheritDoc */


  get length() {
    return this.lastIndex + 1;
  }
  /**
   * Index of the last element from the queue
   */


  lastIndex = -1;
  /**
   * Inner queue to store elements
   */

  /**
   * @param comparator
   */
  constructor(comparator) {
    super();
    this.innerQueue = this.createInnerQueue();
    this.comparator = comparator;
  }
  /** @inheritDoc */


  push(task) {
    this.innerQueue[++this.lastIndex] = task;
    this.fromBottom();
    return this.length;
  }
  /** @inheritDoc */


  pop() {
    const {
      head
    } = this;

    if (this.lastIndex > 0) {
      this.innerQueue[0] = this.innerQueue[this.lastIndex];
      this.lastIndex--;
      this.toBottom();
    } else {
      this.lastIndex = this.lastIndex === 1 ? 0 : -1;
    }

    return head;
  }
  /** @inheritDoc */


  clear() {
    if (this.length > 0) {
      this.innerQueue = this.createInnerQueue();
      this.lastIndex = -1;
    }
  }
  /**
   * Returns a new blank inner queue to store elements
   */


  createInnerQueue = () => [];
  /**
   * Raises the headIndex queue element of the queue up
   */

  fromBottom() {
    let pos = this.lastIndex,
        parent = Math.floor((pos - 1) / 2);
    const val = this.innerQueue[pos];

    while (pos !== 0) {
      const parentVal = this.innerQueue[parent];

      if (this.comparator(val, parentVal) <= 0) {
        break;
      }

      this.innerQueue[pos] = parentVal;
      pos = parent;
      parent = Math.floor((pos - 1) / 2);
    }

    this.innerQueue[pos] = val;
  }
  /**
   * Puts the first queue element down the queue
   */


  toBottom() {
    let pos = 0,
        child1 = 1,
        child2 = 2;
    const val = this.innerQueue[pos];

    while (child1 <= this.lastIndex) {
      let child;

      if (child2 <= this.lastIndex) {
        child = this.comparator(this.innerQueue[child1], this.innerQueue[child2]) > 0 ? child1 : child2;
      } else {
        child = child1;
      }

      const childVal = this.innerQueue[child];

      if (child == null || this.comparator(val, childVal) > 0) {
        break;
      }

      this.innerQueue[pos] = childVal;
      pos = child;
      child1 = pos * 2 + 1;
      child2 = pos * 2 + 2;
    }

    this.innerQueue[pos] = val;
  }

}

exports.default = OrderedQueue;