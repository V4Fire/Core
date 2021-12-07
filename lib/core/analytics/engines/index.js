"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _implementation = require("../../../core/functools/implementation");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Sends the specified analytic event
 * @abstract
 */
const sendEvent = () => {
  (0, _implementation.unimplement)({
    type: 'function',
    name: 'sendAnalyticsEvent'
  });
};

var _default = sendEvent;
exports.default = _default;