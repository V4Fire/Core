"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluralizeMap = exports.locale = exports.event = exports.emitter = void 0;
var _eventemitter = require("eventemitter2");
const emitter = new _eventemitter.EventEmitter2({
  maxListeners: 100,
  newListener: false
});
exports.emitter = emitter;
const event = emitter;
exports.event = event;
const locale = {
  value: undefined,
  isDefault: false
};
exports.locale = locale;
const pluralizeMap = Object.createDict({
  none: 0,
  one: 1,
  some: 2,
  many: 5
});
exports.pluralizeMap = pluralizeMap;