"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromHex = fromHex;
function fromHex(str) {
  return String.fromCodePoint(parseInt(str.slice(2), 16));
}