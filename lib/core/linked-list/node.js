"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class Node {
  next = null;
  prev = null;
  constructor(data) {
    this.data = data;
  }
}
exports.default = Node;