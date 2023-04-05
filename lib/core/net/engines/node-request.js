"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isOnline = isOnline;
var _got = _interopRequireDefault(require("got"));
var _config = _interopRequireDefault(require("../../../config"));
var _const = require("../../../core/net/const");
const {
  online
} = _config.default;
async function isOnline() {
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
      (0, _got.default)(`${url}?_=${Date.now()}`, {
        throwHttpErrors: false,
        method: 'OPTIONS'
      }).then(() => {
        if (timer != null) {
          clearTimeout(timer);
        }
        resolve(true);
      }, retry);
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