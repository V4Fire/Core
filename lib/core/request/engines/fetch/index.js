"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("../../../../core/request/engines/fetch/node"));
var _abortable = _interopRequireDefault(require("../../../../core/promise/abortable"));
var _net = require("../../../../core/net");
var _response = _interopRequireDefault(require("../../../../core/request/response"));
var _error = _interopRequireDefault(require("../../../../core/request/error"));
var _streamBuffer = _interopRequireDefault(require("../../../../core/request/modules/stream-buffer"));
var _helpers = require("../../../../core/request/engines/helpers");
const request = params => {
  const p = params,
    abortController = new AbortController(),
    streamBuffer = new _streamBuffer.default();
  const [body, contentType] = (0, _helpers.convertDataToSend)(p.body, p.contentType);
  const headers = {};
  if (p.headers != null) {
    for (const [name, val] of p.headers) {
      headers[name] = val;
    }
  }
  if (contentType != null) {
    headers['Content-Type'] = contentType;
  }
  let credentials = 'same-origin';
  if (Object.isString(p.credentials)) {
    credentials = p.credentials;
  } else if (p.credentials) {
    credentials = 'include';
  }
  const fetchOpts = {
    body,
    headers,
    credentials,
    method: p.method,
    signal: abortController.signal
  };
  return new _abortable.default(async (resolve, reject, onAbort) => {
    const {
      status
    } = await _abortable.default.resolve((0, _net.isOnline)(), p.parent);
    if (!status) {
      return reject(new _error.default(_error.default.Offline));
    }
    const req = (0, _node.default)(p.url, fetchOpts);
    let timer;
    if (p.timeout != null) {
      timer = setTimeout(() => abortController.abort(), p.timeout);
    }
    onAbort(reason => {
      streamBuffer.destroy(reason);
      abortController.abort();
    });
    req.then(res => {
      clearTimeout(timer);
      const getResponse = () => {
        switch (p.responseType) {
          case 'json':
          case 'document':
          case 'text':
            return res.text();
          case 'formData':
            return res.formData();
          default:
            return res.arrayBuffer();
        }
      };
      getResponse[Symbol.asyncIterator] = () => {
        const contentLength = res.headers.get('Content-Length'),
          total = contentLength != null ? Number(contentLength) : undefined;
        let loaded = 0;
        if (res.body != null) {
          const reader = res.body.getReader();
          (async () => {
            while (true) {
              const {
                done,
                value: data
              } = await reader.read();
              if (done || data == null) {
                streamBuffer.close();
                break;
              }
              loaded += data.length;
              streamBuffer.add({
                total,
                loaded,
                data
              });
            }
          })();
        }
        return streamBuffer[Symbol.asyncIterator]();
      };
      resolve(new _response.default(getResponse, {
        url: res.url,
        redirected: res.redirected,
        type: res.type,
        parent: p.parent,
        important: p.important,
        okStatuses: p.okStatuses,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        responseType: p.responseType,
        forceResponseType: p.forceResponseType,
        decoder: p.decoders,
        streamDecoder: p.streamDecoders,
        jsonReviver: p.jsonReviver
      }));
    }, error => {
      clearTimeout(timer);
      const type = error.name === 'AbortError' ? _error.default.Timeout : _error.default.Engine,
        requestError = new _error.default(type, {
          error
        });
      streamBuffer.destroy(requestError);
      reject(requestError);
    });
  }, p.parent);
};
var _default = request;
exports.default = _default;