"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  attachStatus: true
};
exports.attachStatus = attachStatus;

var _interface = require("../../../../core/data/middlewares/attach-status/interface");

Object.keys(_interface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface[key];
    }
  });
});

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/data/middlewares/attach-status/README.md]]
 * @packageDocumentation
 */

/**
 * Decoder: attaches a response status to response data
 *
 * @param data
 * @param params
 * @param response
 */
function attachStatus(data, params, response) {
  return {
    data,
    status: response.status
  };
}