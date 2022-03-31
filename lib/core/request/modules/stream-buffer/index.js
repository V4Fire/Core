"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promise = require("../../../../core/promise");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/request/modules/stream-buffer/README.md]]
 * @packageDocumentation
 */
class StreamBuffer {
  /**
   * Returns a boolean stating whether the stream is open or not
   */
  get isOpened() {
    return this.pendingPromise != null;
  }
  /**
   * Buffer of added values
   */


  /**
   * @param [values] - values to add
   */
  constructor(values = []) {
    this.buffer = [...values];
    this.isAsyncIteratorInvoked = false;
    this.pendingPromise = (0, _promise.createControllablePromise)();
  }
  /**
   * Returns an iterator allowing to go through all items that were already added
   */


  [Symbol.iterator]() {
    return this.buffer.values();
  }
  /**
   * Returns an async iterator allowing to go through the stream
   */


  [Symbol.asyncIterator]() {
    const that = this,
          iter = createIter();
    return {
      [Symbol.asyncIterator]() {
        return this;
      },

      next: iter.next.bind(iter)
    };

    async function* createIter() {
      that.isAsyncIteratorInvoked = true;
      const {
        buffer
      } = that;

      while (true) {
        if (buffer.length > 0) {
          yield buffer.pop();
          continue;
        }

        if (that.pendingPromise == null) {
          return;
        }

        await that.pendingPromise;
      }
    }
  }
  /**
   * Adds a new value to the stream if it is opened, otherwise does nothing
   * @param value - item to add
   */


  add(value) {
    if (!this.isOpened) {
      return;
    }

    this.buffer.push(value);
    this.pendingPromise.resolve();
    this.pendingPromise = (0, _promise.createControllablePromise)();
  }
  /**
   * Closes the stream
   */


  close() {
    if (!this.isOpened) {
      return;
    }

    this.pendingPromise.resolve();
    this.pendingPromise = null;
  }
  /**
   * Destroys the stream
   * @param [reason] - reason to destroy
   */


  destroy(reason) {
    if (!this.isOpened) {
      return;
    }

    if (this.isAsyncIteratorInvoked) {
      this.pendingPromise.reject(reason ?? Error('The stream has been destroyed'));
    } else {
      this.pendingPromise.resolve();
    }

    this.pendingPromise = null;
  }

}

exports.default = StreamBuffer;