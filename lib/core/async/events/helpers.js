"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEvent = isEvent;
function isEvent(value) {
  return Object.isPlainObject(value) && Object.isString(value.event);
}