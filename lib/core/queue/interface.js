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
 * An abstract class for any queue data structure
 * @typeparam T - queue element
 */
class Queue {
  /**
   * The first element in the queue
   */

  /**
   * Number of elements in the queue
   */

  /**
   * Adds a new element to the queue
   * @param el
   */

  /**
   * Removes the head element from the queue and returns it
   */

  /**
   * Alias to `push`
   * @see [[Queue.push]]
   */
  unshift(el) {
    return Object.cast(this.push(el));
  }
  /**
   * Alias to `pop`
   * @see [[Queue.pop]]
   */


  shift() {
    return Object.cast(this.pop());
  }
  /**
   * Clears the queue
   */


  /**
   * Returns an iterator over the queue elements
   */
  [Symbol.iterator]() {
    return this.values();
  }
  /**
   * Returns an iterator over the queue elements
   */


  values() {
    const clonedQueue = this.clone();
    return {
      [Symbol.iterator]() {
        return this;
      },

      next() {
        const done = clonedQueue.length <= 0,
              value = clonedQueue.pop();

        if (done || value == null) {
          return {
            done: true,
            value: undefined
          };
        }

        return {
          done,
          value
        };
      }

    };
  }

}

exports.default = Queue;