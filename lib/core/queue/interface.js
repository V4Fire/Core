"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class Queue {
  unshift(el) {
    return Object.cast(this.push(el));
  }
  shift() {
    return Object.cast(this.pop());
  }
  [Symbol.iterator]() {
    return this.values();
  }
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