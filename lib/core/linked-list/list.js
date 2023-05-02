"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("../../core/linked-list/node"));
class List {
  get length() {
    return this.lengthStore;
  }
  get first() {
    return this.firstNode?.data;
  }
  get last() {
    return this.lastNode?.data;
  }
  firstNode = null;
  lastNode = null;
  lengthStore = 0;
  constructor(iterable) {
    if (Object.isIterable(iterable)) {
      for (const el of iterable) {
        this.push(el);
      }
    }
  }
  [Symbol.iterator]() {
    return this.values();
  }
  unshift(...data) {
    data.forEach(data => {
      const link = new _node.default(data);
      if (this.firstNode != null) {
        this.firstNode.prev = link;
      } else {
        this.lastNode = link;
      }
      link.next = this.firstNode;
      this.firstNode = link;
      this.lengthStore++;
    });
    return this.lengthStore;
  }
  shift() {
    if (this.lengthStore === 0) {
      return;
    }
    this.lengthStore--;
    const first = this.firstNode;
    if (first == null) {
      return;
    }
    this.firstNode = first.next;
    if (this.firstNode == null) {
      this.clear();
      return first.data;
    }
    first.next = null;
    return first.data;
  }
  push(...data) {
    data.forEach(data => {
      const link = new _node.default(data);
      if (this.lastNode == null) {
        this.firstNode = link;
      } else {
        this.lastNode.next = link;
        link.prev = this.lastNode;
      }
      this.lastNode = link;
      this.lengthStore++;
    });
    return this.lengthStore;
  }
  pop() {
    if (this.lengthStore === 0) {
      return;
    }
    this.lengthStore--;
    const last = this.lastNode;
    if (last == null) {
      return;
    }
    this.lastNode = last.prev;
    if (this.lastNode == null) {
      this.clear();
      return last.data;
    }
    this.lastNode.next = null;
    last.prev = null;
    return last.data;
  }
  includes(data) {
    if (Number.isNaN(data)) {
      for (const el of this) {
        if (Number.isNaN(el)) {
          return true;
        }
      }
    } else {
      for (const el of this) {
        if (el === data) {
          return true;
        }
      }
    }
    return false;
  }
  clear() {
    this.lengthStore = 0;
    this.firstNode = null;
    this.lastNode = null;
  }
  slice(start, end) {
    if (start == null) {
      return new List(this);
    }
    if (start < 0 && end != null) {
      return new List([...this].slice(start, end));
    }
    let iter,
      reversed = false;
    if (start < 0) {
      start = Math.abs(start) - 1;
      end = start + 1;
      iter = this.reverse();
      reversed = true;
    } else {
      iter = this.values();
    }
    end ??= this.length;
    if (end < 0) {
      end += this.length;
    }
    let i = 0,
      done = false;
    const sliceIter = {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        while (true) {
          if (done) {
            return {
              value: undefined,
              done: true
            };
          }
          const chunk = iter.next();
          if (chunk.done) {
            done = true;
            return chunk;
          }
          if (i >= start) {
            if (i++ < end) {
              return chunk;
            }
            done = true;
            return {
              value: chunk.value,
              done
            };
          }
          i++;
        }
      }
    };
    return new List(reversed ? [...sliceIter].reverse() : sliceIter);
  }
  values() {
    let current = this.firstNode,
      cursor = 0;
    const length = this.lengthStore;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        const done = length <= cursor++,
          value = current;
        current = value?.next;
        if (done || value == null) {
          return {
            done: true,
            value: undefined
          };
        }
        return {
          done,
          value: value.data
        };
      }
    };
  }
  reverse() {
    let current = this.lastNode,
      cursor = 0;
    const length = this.lengthStore;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        const done = length <= cursor++,
          value = current;
        current = value?.prev;
        if (done || value == null) {
          return {
            done: true,
            value: undefined
          };
        }
        return {
          done,
          value: value.data
        };
      }
    };
  }
}
exports.default = List;