"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isOnline = isOnline;

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
globalThis.addEventListener('online', () => _const.emitter.emit('sync'));
globalThis.addEventListener('offline', () => _const.emitter.emit('sync'));
/**
 * Returns true if the current host has a connection to the internet or null
 * if the connection status can't be checked.
 *
 * This engine checks the connection by using a request for some data from the internet.
 */

async function isOnline() {
  if ('onLine' in navigator && !navigator.onLine) {
    return false;
  }

  const url = online.checkURL;

  if (url == null || url === '') {
    return null;
  }

  return new Promise(resolve => {
    let retriesCount = 0;
    let timer,
        timeout = false;

    if (online.checkTimeout != null) {
      timer = setTimeout(() => {
        timeout = true;
        resolve(false);
      }, online.checkTimeout);
    }

    checkOnline();

    function checkOnline() {
      const xhr = new XMLHttpRequest();
      xhr.open('OPTIONS', `${url}?_=${Date.now()}`, true);
      xhr.addEventListener('readystatechange', () => {
        if (timer != null) {
          clearTimeout(timer);
        }

        resolve(true);
      }, {
        once: true
      });
      xhr.addEventListener('error', retry, {
        once: true
      });
      xhr.send();
    }

    function retry() {
      if (timeout) {
        return;
      }

      if (_const.state.status == null || online.retryCount == null || ++retriesCount > online.retryCount) {
        resolve(false);
      } else {
        checkOnline();
      }
    }
  });
}