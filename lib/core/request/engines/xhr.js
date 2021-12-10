"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xhr = _interopRequireDefault(require("xhr2"));

var _abortable = _interopRequireDefault(require("../../../core/promise/abortable"));

var _env = require("../../../core/env");

var _net = require("../../../core/net");

var _response = _interopRequireDefault(require("../../../core/request/response"));

var _error = _interopRequireDefault(require("../../../core/request/error"));

var _helpers = require("../../../core/request/engines/helpers");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Creates request by using XMLHttpRequest with the specified parameters and returns a promise
 * @param params
 */
const request = params => {
  const p = params,
        xhr = new _xhr.default();
  let [body, contentType] = (0, _helpers.convertDataToSend)(p.body, p.contentType);

  if (!_env.IS_NODE && body instanceof FormData && contentType == null) {
    contentType = '';
  }

  xhr.open(p.method, p.url, true);

  if (p.timeout != null) {
    xhr.timeout = p.timeout;
  }

  switch (p.responseType) {
    case 'json':
    case 'text':
      xhr.responseType = 'text';
      break;

    case 'document':
      xhr.responseType = _env.IS_NODE ? 'text' : 'document';
      break;

    default:
      xhr.responseType = 'arraybuffer';
  }

  if (p.credentials) {
    xhr.withCredentials = true;
  }

  if (p.headers) {
    for (let o = p.headers, keys = Object.keys(o), i = 0; i < keys.length; i++) {
      const name = keys[i],
            val = o[name];

      if (Object.isArray(val)) {
        for (let i = 0; i < val.length; i++) {
          const el = val[i]; // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition

          if (el != null) {
            xhr.setRequestHeader(name, el);
          }
        }
      } else if (val != null) {
        xhr.setRequestHeader(name, val);
      }
    }
  }

  if (contentType != null) {
    xhr.setRequestHeader('Content-Type', contentType);
  }

  return new _abortable.default(async (resolve, reject, onAbort) => {
    const {
      status
    } = await _abortable.default.resolve((0, _net.isOnline)(), p.parent);

    if (!status) {
      return reject(new _error.default(_error.default.Offline, {
        request: xhr
      }));
    }

    onAbort(() => {
      xhr.abort();
    });
    xhr.addEventListener('load', () => {
      resolve(new _response.default(xhr.response, {
        parent: p.parent,
        important: p.important,
        responseType: p.responseType,
        okStatuses: p.okStatuses,
        status: xhr.status,
        headers: xhr.getAllResponseHeaders(),
        decoder: p.decoders,
        jsonReviver: p.jsonReviver
      }));
    });
    xhr.addEventListener('error', error => {
      reject(new _error.default(_error.default.Engine, {
        error
      }));
    });
    xhr.addEventListener('timeout', () => {
      reject(new _error.default(_error.default.Timeout));
    });
    xhr.send(body);
  }, p.parent);
};

var _default = request;
exports.default = _default;