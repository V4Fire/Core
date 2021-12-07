"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  merge: true,
  getRequestKey: true,
  applyQueryForStr: true,
  normalizeHeaderName: true,
  normalizeHeaderValue: true,
  normalizeHeaders: true,
  dropCache: true
};
exports.applyQueryForStr = applyQueryForStr;
exports.dropCache = dropCache;
exports.getRequestKey = getRequestKey;
exports.merge = merge;
exports.normalizeHeaderName = normalizeHeaderName;
exports.normalizeHeaderValue = normalizeHeaderValue;
exports.normalizeHeaders = normalizeHeaders;

var _const = require("../../../core/request/const");

var _const2 = require("../../../core/request/utils/const");

Object.keys(_const2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _const2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _const2[key];
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
 * [[include:core/request/utils/README.md]]
 * @packageDocumentation
 */

/**
 * Merges the specified arguments and returns a new object
 * @param args
 */
function merge(...args) {
  return Object.mixin({
    deep: true,
    concatArrays: (a, b) => a.union(b),
    extendFilter: el => Array.isArray(el) || Object.isDictionary(el)
  }, undefined, ...args);
}
/**
 * Generates a string cache key for the specified parameters and returns it
 *
 * @param url - request url
 * @param [params] - request parameters
 */


function getRequestKey(url, params) {
  const plainHeaders = [];
  let bodyKey = '';

  if (params) {
    for (let o = normalizeHeaders(params.headers), keys = Object.keys(o), i = 0; i < keys.length; i++) {
      const name = keys[i];
      plainHeaders.push([name, String(o[name])]);
    }

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
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (el == null) {
            el = String(el);
          }

          if (!Object.isString(el)) {
            try {
              // @ts-ignore (nodejs)
              el = el.toString('base64');
            } catch {
              el = el.toString();
            }
          }

          bodyKey += `${key}=${el}`;
        });
      } else {
        try {
          // @ts-ignore (nodejs)
          bodyKey = body.toString('base64');
        } catch {
          bodyKey = body.toString();
        }
      }
    }
  }

  return JSON.stringify([url, params?.method, plainHeaders, bodyKey, params?.timeout]);
}
/**
 * Applies a query object for the specified string
 * (used keys are removed from the query)
 *
 * @param str
 * @param [query]
 * @param [rgxp] - template regexp
 */


function applyQueryForStr(str, query, rgxp = _const2.tplRgxp) {
  if (!query) {
    return str;
  }

  return str.replace(rgxp, (str, param, adv = '') => {
    const val = query[param];

    if (val != null) {
      Object.defineProperty(query, param, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: query[param]
      });
      return (str.startsWith('/') ? '/' : '') + String(val) + String(Object.isNumber(adv) ? '' : adv);
    }

    return '';
  });
}
/**
 * Normalizes the specified HTTP header name
 *
 * @param name
 * @param [query] - request query object (for interpolation of value)
 */


function normalizeHeaderName(name, query) {
  return applyQueryForStr(String(name).trim(), query).toLowerCase();
}
/**
 * Normalizes the specified HTTP header value
 *
 * @param value
 * @param [query] - request query object (for interpolation of value)
 */


function normalizeHeaderValue(value, query) {
  return applyQueryForStr(String(value != null ? value : '').trim(), query);
}
/**
 * Normalizes the specified HTTP header object
 *
 * @param headers
 * @param [query] - request query object (to interpolate keys/values)
 */


function normalizeHeaders(headers, query) {
  const res = {};

  if (headers) {
    for (let keys = Object.keys(headers), i = 0; i < keys.length; i++) {
      let name = keys[i],
          val = headers[name];

      if (Object.isArray(val)) {
        const arr = [];

        for (let i = 0; i < val.length; i++) {
          const el = normalizeHeaderValue(val[i], query);

          if (el !== '') {
            arr.push(el);
          }
        }

        val = arr;
      } else {
        val = normalizeHeaderValue(val, query);
      }

      if (val.length > 0) {
        name = normalizeHeaderName(name, query);

        if (name !== '') {
          res[name] = val;
        }
      }
    }
  }

  return res;
}
/**
 * Truncates all static cache storage-s
 */


function dropCache() {
  Object.forEach(_const.caches, cache => {
    cache.clear();
  });

  _const.caches.clear();
}