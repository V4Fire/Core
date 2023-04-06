"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _implementation = require("../../../core/functools/implementation");
const sendEvent = () => {
  (0, _implementation.unimplement)({
    type: 'function',
    name: 'sendAnalyticsEvent'
  });
};
var _default = sendEvent;
exports.default = _default;