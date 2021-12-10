"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _got = _interopRequireDefault(require("got"));

var _abortable = _interopRequireDefault(require("../../../core/promise/abortable"));

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
 * Creates request by using node.js with the specified parameters and returns a promise
 * @param params
 */
const request = params => {
  const p = params;
  const [body, contentType] = (0, _helpers.convertDataToSend)(p.body);
  const headers = { ...p.headers
  };

  if (contentType != null) {
    Object.assign(headers, {
      'Content-Type': contentType
    });
  }

  const normalizedOpts = {
    throwHttpErrors: false,
    method: p.method,
    timeout: p.timeout,
    retry: 0,
    headers,
    body
  };

  if (p.responseType != null) {
    let v;

    switch (p.responseType) {
      case 'json':
      case 'document':
        v = 'text';
        break;

      case 'arrayBuffer':
      case 'blob':
        v = 'buffer';
        break;

      default:
        v = p.responseType.toLowerCase();
    }

    normalizedOpts.responseType = v;
  } else {
    normalizedOpts.responseType = 'buffer';
  }

  return new _abortable.default(async (resolve, reject, onAbort) => {
    const {
      status
    } = await _abortable.default.resolve((0, _net.isOnline)(), p.parent);

    if (!status) {
      return reject(new _error.default(_error.default.Offline, {
        request: normalizedOpts
      }));
    }

    const request = (0, _got.default)(p.url, normalizedOpts);
    onAbort(() => {
      request.cancel();
    });
    request.then(res => {
      resolve(new _response.default(Object.cast(res.body), {
        parent: p.parent,
        important: p.important,
        responseType: p.responseType,
        okStatuses: p.okStatuses,
        status: res.statusCode,
        headers: res.headers,
        jsonReviver: p.jsonReviver,
        decoder: p.decoders
      }));
    }, error => {
      const type = error.name === 'TimeoutError' ? _error.default.Timeout : _error.default.Engine;
      reject(new _error.default(type, {
        error
      }));
    });
  }, p.parent);
};

var _default = request;
exports.default = _default;