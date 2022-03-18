"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xhr = _interopRequireDefault(require("xhr2"));

var _abortable = _interopRequireDefault(require("../../../../core/promise/abortable"));

var _env = require("../../../../core/env");

var _net = require("../../../../core/net");

var _response = _interopRequireDefault(require("../../../../core/request/response"));

var _error = _interopRequireDefault(require("../../../../core/request/error"));

var _streamBuffer = _interopRequireDefault(require("../../../../core/request/modules/stream-buffer"));

var _helpers = require("../../../../core/request/engines/helpers");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/request/engines/xhr/README.md]]
 * @packageDocumentation
 */

/**
 * Creates request by using XMLHttpRequest with the specified parameters and returns a promise
 * @param params
 */
const request = params => {
  const p = params,
        xhr = new _xhr.default(),
        streamBuffer = new _streamBuffer.default();
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
    for (const [name, val] of p.headers) {
      xhr.setRequestHeader(name, val);
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
      return reject(new _error.default(_error.default.Offline));
    }

    onAbort(reason => {
      streamBuffer.destroy(reason);
      xhr.abort();
    });
    const registeredEvents = Object.createDict();
    p.emitter.on('newListener', event => {
      if (registeredEvents[event]) {
        return;
      }

      registeredEvents[event] = true;

      if (event.startsWith('upload.')) {
        xhr.upload.addEventListener(event.split('.').slice(1).join('.'), e => {
          p.emitter.emit(event, e);
        });
      } else {
        xhr.addEventListener(event, e => {
          p.emitter.emit(event, e);
        });
      }
    });
    p.emitter.emit('drainListeners');
    xhr.addEventListener('progress', e => {
      streamBuffer.add({
        total: e.total,
        loaded: e.loaded
      });
    });
    const getResponse = new Promise(resolve => {
      xhr.addEventListener('load', () => {
        streamBuffer.close();
        resolve(xhr.response);
      });
    });
    getResponse[Symbol.asyncIterator] = streamBuffer[Symbol.asyncIterator].bind(streamBuffer);
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState !== 2) {
        return;
      }

      const response = new _response.default(getResponse, {
        url: xhr.responseURL,
        redirected: p.url !== xhr.responseURL,
        parent: p.parent,
        important: p.important,
        okStatuses: p.okStatuses,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: xhr.getAllResponseHeaders(),
        responseType: p.responseType,
        decoder: p.decoders,
        streamDecoder: p.streamDecoders,
        jsonReviver: p.jsonReviver
      });
      resolve(response);
    });
    xhr.addEventListener('error', error => {
      const requestError = new _error.default(_error.default.Engine, {
        error
      });
      streamBuffer.destroy(requestError);
      reject(new _error.default(_error.default.Engine, {
        error
      }));
    });
    xhr.addEventListener('timeout', () => {
      const requestError = new _error.default(_error.default.Timeout);
      streamBuffer.destroy(requestError);
      reject(requestError);
    });
    xhr.send(body);
  }, p.parent);
};

var _default = request;
exports.default = _default;