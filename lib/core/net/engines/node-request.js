"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isOnline = isOnline;

var _got = _interopRequireDefault(require("got"));

var _config = _interopRequireDefault(require("../../../config"));

var _const = require("../../../core/net/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const {
  online
} = _config.default;
/**
 * Returns true if the current host has a connection to the internet or null
 * if the connection status can't be checked.
 *
 * This engine checks the connection by using a request for some data from the internet.
 */

async function isOnline() {
  const url = online.checkURL;

  if (url == null || url === '') {
    return null;
  }

  let retriesCount = 0;
  return new Promise(resolve => {
    const retry = () => {
      if (_const.state.status == null || online.retryCount == null || ++retriesCount > online.retryCount) {
        resolve(false);
      } else {
        checkOnline();
      }
    };

    checkOnline();

    function checkOnline() {
      (0, _got.default)(`${url}?d=${Date.now()}`, {
        timeout: online.checkTimeout,
        throwHttpErrors: false
      }).then(resolve.bind(null, true), retry);
    }
  });
}