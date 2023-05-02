"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hashVal = exports.borrowCounter = void 0;
const hashVal = Symbol('Hash value of the object'),
  borrowCounter = Symbol('How many consumers borrow this resource');
exports.borrowCounter = borrowCounter;
exports.hashVal = hashVal;