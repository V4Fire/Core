"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.region = exports.locale = exports.event = exports.emitter = void 0;
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
const region = {
  value: undefined,
  isDefault: false
};
exports.region = region;