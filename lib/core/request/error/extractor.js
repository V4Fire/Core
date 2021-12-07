"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestErrorDetailsExtractor = void 0;

var _error = _interopRequireDefault(require("../../../core/request/error"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Extractor that gets details from `RequestError`
 */
class RequestErrorDetailsExtractor {
  /** @inheritDoc */
  target = _error.default;
  /**
   * Settings that define which header makes its way to the result
   */

  constructor(settings) {
    this.headerSettings = {
      include: new Set(settings?.headers.include),
      exclude: new Set(settings?.headers.exclude)
    };
  }
  /** @inheritDoc */


  extract(error) {
    return {
      url: error.details.request?.url,
      type: error.type,
      status: error.details.response?.status,
      method: error.details.request?.method,
      query: error.details.request?.query,
      contentType: error.details.request?.contentType,
      withCredentials: error.details.request?.credentials,
      requestHeaders: this.prepareHeaders(error.details.request?.headers),
      requestBody: error.details.request?.body,
      responseHeaders: this.prepareHeaders(error.details.response?.headers),
      responseBody: error.details.response?.body
    };
  }
  /**
   * Filters the specified headers according to settings {@see headerSettings}
   * @param headers - headers that need to be filtered
   */


  prepareHeaders(headers) {
    let filteredHeaders = headers;

    const filterHeaders = (originalHeaders, filter) => Object.keys(originalHeaders).filter(filter).reduce((headers, headerName) => {
      headers[headerName] = originalHeaders[headerName];
      return headers;
    }, {});

    if (headers) {
      if (this.headerSettings.include.size > 0) {
        filteredHeaders = filterHeaders(headers, headerName => this.headerSettings.include.has(headerName));
      } else if (this.headerSettings.exclude.size > 0) {
        filteredHeaders = filterHeaders(headers, headerName => !this.headerSettings.exclude.has(headerName));
      }
    }

    return filteredHeaders;
  }

}

exports.RequestErrorDetailsExtractor = RequestErrorDetailsExtractor;