"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _got = _interopRequireDefault(require("got"));

var _abortable = _interopRequireDefault(require("../../../../core/promise/abortable"));

var _net = require("../../../../core/net");

var _response = _interopRequireDefault(require("../../../../core/request/response"));

var _error = _interopRequireDefault(require("../../../../core/request/error"));

var _streamBuffer = _interopRequireDefault(require("../../../../core/request/modules/stream-buffer"));

var _helpers = require("../../../../core/request/engines/helpers");

var _const = require("../../../../core/request/engines/node/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/request/engines/node/README.md]]
 * @packageDocumentation
 */

/**
 * Creates request by using node.js with the specified parameters and returns a promise
 * @param params
 */
const request = params => {
  const p = params,
        streamBuffer = new _streamBuffer.default();
  const [body, contentType] = (0, _helpers.convertDataToSend)(p.body);
  const headers = { ...p.headers
  };

  if (contentType != null) {
    Object.assign(headers, {
      'content-type': contentType
    });
  }

  const gotOpts = {
    body,
    headers,
    method: p.method,
    throwHttpErrors: false,
    timeout: p.timeout,
    retry: 0
  };
  return new _abortable.default(async (resolve, reject, onAbort) => {
    const {
      status
    } = await _abortable.default.resolve((0, _net.isOnline)(), p.parent);

    if (!status) {
      return reject(new _error.default(_error.default.Offline));
    }

    const stream = _got.default.stream(p.url, Object.cast(gotOpts));

    onAbort(reason => {
      streamBuffer.destroy(reason);
      stream.destroy();
    });

    if (needEndStream(gotOpts)) {
      stream.end();
    }

    const registeredEvents = Object.createDict();
    p.emitter.on('newListener', event => {
      if (registeredEvents[event]) {
        return;
      }

      registeredEvents[event] = true;
      stream.on(event, e => p.emitter.emit(event, e));
    });
    p.emitter.emit('drainListeners');
    stream.on('error', error => {
      const type = error.name === 'TimeoutError' ? _error.default.Timeout : _error.default.Engine,
            requestError = new _error.default(type, {
        error
      });
      streamBuffer.destroy(requestError);
      reject(requestError);
    });
    stream.on('response', response => {
      const contentLength = response.headers['content-length'],
            total = contentLength != null ? Number(contentLength) : undefined;
      let loaded = 0;

      (async () => {
        try {
          for await (const data of stream) {
            loaded += data.length;
            streamBuffer.add({
              total,
              loaded,
              data
            });
          }

          streamBuffer.close();
        } catch {}
      })();

      const getResponse = async () => {
        const completeData = new Uint8Array(loaded);
        let pos = 0;

        for await (const {
          data
        } of streamBuffer) {
          if (data == null) {
            continue;
          }

          completeData.set(data, pos);
          pos += data.length;
        }

        return completeData.buffer;
      };

      getResponse[Symbol.asyncIterator] = streamBuffer[Symbol.asyncIterator].bind(streamBuffer);
      const res = new _response.default(getResponse, {
        url: response.url,
        redirected: response.redirectUrls.length !== 0,
        parent: p.parent,
        important: p.important,
        okStatuses: p.okStatuses,
        status: response.statusCode,
        statusText: response.statusMessage,
        headers: Object.cast(response.headers),
        responseType: p.responseType,
        decoder: p.decoders,
        streamDecoder: p.streamDecoders,
        jsonReviver: p.jsonReviver
      });
      resolve(res);
    });

    function needEndStream({
      body,
      method
    }) {
      return body == null && method != null && _const.writeableStreamMethods[method.toUpperCase()];
    }
  }, p.parent);
};

var _default = request;
exports.default = _default;