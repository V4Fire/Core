"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hashVal = exports.borrowCounter = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const hashVal = Symbol('Hash value of the object'),
      borrowCounter = Symbol('How many consumers borrow this resource');
exports.borrowCounter = borrowCounter;
exports.hashVal = hashVal;