"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropCache = dropCache;
exports.getRequestKey = getRequestKey;
var _headers = _interopRequireDefault(require("../../../core/request/headers"));
var _const = require("../../../core/request/const");
function dropCache() {
  Object.forEach(_const.caches, cache => {
    cache.clear();
  });
  _const.caches.clear();
}
function getRequestKey(url, params) {
  const plainHeaders = [];
  let bodyKey = '';
  if (params) {
    plainHeaders.push(...new _headers.default(params.headers));
    plainHeaders.sort(([name1], [name2]) => {
      if (name1 < name2) {
        return -1;
      }
      if (name1 > name2) {
        return 1;
      }
      return 0;
    });
    const {
      body
    } = params;
    if (body != null) {
      if (Object.isString(body)) {
        bodyKey = body;
      } else if (Object.isPlainObject(body)) {
        bodyKey = JSON.stringify(body);
      } else if (body instanceof FormData) {
        body.forEach((el, key) => {
          if (!Object.isTruly(el)) {
            el = String(el);
          }
          if (!Object.isString(el)) {
            try {
              el = el.toString('base64');
            } catch {
              el = el.toString();
            }
          }
          bodyKey += `${key}=${el}`;
        });
      } else {
        try {
          bodyKey = body.toString('base64');
        } catch {
          bodyKey = body.toString();
        }
      }
    }
  }
  return JSON.stringify([url, params?.method, plainHeaders, bodyKey, params?.timeout]);
}