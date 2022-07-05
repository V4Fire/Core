"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _error = _interopRequireWildcard(require("../../../core/request/error"));

var _headers = _interopRequireDefault(require("../../../core/request/headers"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-disable max-lines, max-lines-per-function */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/request/error', () => {
  let err;
  beforeEach(() => {
    err = new _error.default(_error.default.Timeout, {
      request: {
        url: 'url/url',
        query: {
          googleIt: 'yes'
        },
        body: 'request body',
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        credentials: false,
        headers: {
          content: 'json',
          token: 'important token',
          foo: 'bla'
        }
      },
      response: {
        status: 404,
        body: 'not found',
        headers: {
          content: 'xml',
          token: 'other token',
          foo: 'bla'
        }
      }
    });
  });
  describe('`RequestErrorDetailsExtractor`', () => {
    it('should extract information from the passed error', () => {
      const extractor = new _error.RequestErrorDetailsExtractor();
      expect(extractor.extract(err)).toEqual({
        type: 'timeout',
        status: 404,
        url: 'url/url',
        query: {
          googleIt: 'yes'
        },
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        withCredentials: false,
        requestBody: 'request body',
        responseBody: 'not found',
        requestHeaders: new _headers.default({
          content: 'json',
          token: 'important token',
          foo: 'bla'
        }),
        responseHeaders: new _headers.default({
          content: 'xml',
          token: 'other token',
          foo: 'bla'
        })
      });
    });
    it('should extract information from the passed error, keeping only those headers that are explicitly specified', () => {
      const extractor = new _error.RequestErrorDetailsExtractor({
        headers: {
          include: ['content', 'foo']
        }
      });
      expect(extractor.extract(err)).toEqual({
        type: 'timeout',
        status: 404,
        url: 'url/url',
        query: {
          googleIt: 'yes'
        },
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        withCredentials: false,
        requestBody: 'request body',
        responseBody: 'not found',
        requestHeaders: new _headers.default({
          content: 'json',
          foo: 'bla'
        }),
        responseHeaders: new _headers.default({
          content: 'xml',
          foo: 'bla'
        })
      });
    });
    it('should extract information from the passed error, excluding those headers that are explicitly specified', () => {
      const extractor = new _error.RequestErrorDetailsExtractor({
        headers: {
          exclude: ['token']
        }
      });
      expect(extractor.extract(err)).toEqual({
        type: 'timeout',
        status: 404,
        url: 'url/url',
        query: {
          googleIt: 'yes'
        },
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        withCredentials: false,
        requestBody: 'request body',
        responseBody: 'not found',
        requestHeaders: new _headers.default({
          content: 'json',
          foo: 'bla'
        }),
        responseHeaders: new _headers.default({
          content: 'xml',
          foo: 'bla'
        })
      });
    });
    it('should ignore the `exclude` option when `include` is passed', () => {
      const extractor = new _error.RequestErrorDetailsExtractor({
        headers: {
          include: ['content'],
          exclude: ['content', 'token']
        }
      });
      expect(extractor.extract(err)).toEqual({
        type: 'timeout',
        status: 404,
        url: 'url/url',
        query: {
          googleIt: 'yes'
        },
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        withCredentials: false,
        requestBody: 'request body',
        responseBody: 'not found',
        requestHeaders: new _headers.default({
          content: 'json'
        }),
        responseHeaders: new _headers.default({
          content: 'xml'
        })
      });
    });
  });
});