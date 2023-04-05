"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.state = exports.event = exports.emitter = void 0;
var _eventemitter = require("eventemitter2");
const emitter = new _eventemitter.EventEmitter2({
  maxListeners: 100,
  newListener: false
});
exports.emitter = emitter;
const event = emitter;
exports.event = event;
const state = {
  status: undefined,
  lastOnline: undefined
};
exports.state = state;