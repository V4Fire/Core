"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _abortController = _interopRequireDefault(require("abort-controller"));

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
 * Creates request by using the fetch API with the specified parameters and returns a promise
 * @param params
 */
const request = params => {
  const p = params,
        controller = new _abortController.default();
  const [body, contentType] = (0, _helpers.convertDataToSend)(p.body, p.contentType);
  const headers = {};

  if (p.headers != null) {
    for (const name of Object.keys(p.headers)) {
      const val = p.headers[name];

      if (val == null) {
        continue;
      }

      headers[name] = Array.isArray(val) ? val.join(', ') : val;
    }
  }

  if (contentType != null) {
    headers['Content-Type'] = contentType;
  }

  const normalizedOpts = {
    body,
    credentials: p.credentials ? 'include' : 'same-origin',
    headers,
    method: p.method,
    signal: controller.signal
  };
  return new _abortable.default(async (resolve, reject, onAbort) => {
    const {
      status
    } = await _abortable.default.resolve((0, _net.isOnline)(), p.parent);

    if (!status) {
      return reject(new _error.default(_error.default.Offline, {
        request: normalizedOpts
      }));
    }

    const req = (0, _nodeFetch.default)(p.url, normalizedOpts);
    let timer;

    if (p.timeout != null) {
      timer = setTimeout(() => controller.abort(), p.timeout);
    }

    onAbort(() => {
      controller.abort();
    });
    req.then(async response => {
      clearTimeout(timer);
      let body;
      const headers = {};
      response.headers.forEach((value, name) => {
        headers[name] = value;
      });

      switch (p.responseType) {
        case 'json':
        case 'document':
        case 'text':
          body = await response.text();
          break;

        default:
          body = await response.arrayBuffer();
      }

      resolve(new _response.default(body, {
        parent: p.parent,
        important: p.important,
        responseType: p.responseType,
        okStatuses: p.okStatuses,
        status: response.status,
        headers,
        decoder: p.decoders,
        jsonReviver: p.jsonReviver
      }));
    }, error => {
      clearTimeout(timer);
      const type = error.name === 'AbortError' ? _error.default.Timeout : _error.default.Engine;
      reject(new _error.default(type, {
        error
      }));
    });
  }, p.parent);
};

var _default = request;
exports.default = _default;