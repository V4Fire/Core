"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestErrorDetailsExtractor = void 0;
var _error = _interopRequireDefault(require("../../../core/request/error"));
var _headers = _interopRequireDefault(require("../../../core/request/headers"));
class RequestErrorDetailsExtractor {
  target = _error.default;
  constructor(opts) {
    this.headersFilterParams = {
      include: new Set(opts?.headers.include),
      exclude: new Set(opts?.headers.exclude)
    };
  }
  extract(error) {
    const d = error.details.deref() ?? {};
    return {
      url: d.request?.url,
      type: error.type,
      status: d.response?.status,
      method: d.request?.method,
      query: d.request?.query,
      contentType: d.request?.contentType,
      withCredentials: d.request?.credentials,
      requestHeaders: this.prepareHeaders(d.request?.headers),
      requestBody: d.request?.body,
      responseHeaders: this.prepareHeaders(d.response?.headers),
      responseBody: d.response?.body
    };
  }
  prepareHeaders(headers) {
    if (headers == null) {
      return;
    }
    const p = this.headersFilterParams,
      filteredHeaders = new _headers.default(headers);
    if (p.include.size > 0) {
      filterHeaders(filteredHeaders, headerName => p.include.has(headerName));
    } else if (p.exclude.size > 0) {
      filterHeaders(filteredHeaders, headerName => !p.exclude.has(headerName));
    }
    return filteredHeaders;
    function filterHeaders(headers, filter) {
      headers.forEach((_, name) => {
        if (!filter(name)) {
          headers.delete(name);
        }
      });
    }
  }
}
exports.RequestErrorDetailsExtractor = RequestErrorDetailsExtractor;