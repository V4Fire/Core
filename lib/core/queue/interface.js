"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Abstract class for a queue data structure
 * @typeparam T - queue element
 */
class Queue {
  /**
   * Queue head
   */

  /**
   * Queue length
   */

  /**
   * Adds an element to the queue
   * @param el
   */

  /**
   * Removes a head element from the queue and returns it
   */

  /**
   * Alias to .push
   * @see [[Queue.push]]
   */
  unshift(el) {
    return Object.cast(this.push(el));
  }
  /**
   * Alias to .pop
   * @see [[Queue.pop]]
   */


  shift() {
    return Object.cast(this.pop());
  }
  /**
   * Clears the queue
   */


}

exports.default = Queue;