"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _promise = require("../../../../core/promise");
class StreamBuffer {
  get isOpened() {
    return this.pendingPromise != null;
  }
  constructor(values = []) {
    this.buffer = [...values];
    this.isAsyncIteratorInvoked = false;
    this.pendingPromise = (0, _promise.createControllablePromise)();
  }
  [Symbol.iterator]() {
    return this.buffer.values();
  }
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
          yield buffer.shift();
          continue;
        }
        if (that.pendingPromise == null) {
          return;
        }
        await that.pendingPromise;
      }
    }
  }
  add(value) {
    if (!this.isOpened) {
      return;
    }
    this.buffer.push(value);
    this.pendingPromise.resolve();
    this.pendingPromise = (0, _promise.createControllablePromise)();
  }
  close() {
    if (!this.isOpened) {
      return;
    }
    this.pendingPromise.resolve();
    this.pendingPromise = null;
  }
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