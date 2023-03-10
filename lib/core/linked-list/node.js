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
 * Linked list node
 * @typeparam T - node data
 */
class Node {
  /**
   * Node data
   */

  /**
   * A link to the next node
   */
  next = null;
  /**
   * A link to the previous node
   */

  prev = null;
  /**
   * @param [data]
   */

  constructor(data) {
    this.data = data;
  }

}

exports.default = Node;