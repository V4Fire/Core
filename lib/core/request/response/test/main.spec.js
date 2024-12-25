"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _request = require("../../../../core/request");
var _headers = _interopRequireDefault(require("../../../../core/request/headers"));
describe('core/request/response', () => {
  test(['should successfully handle a request with the Content-Type: application/octet-stream header', 'and an empty response body'].join(' '), async () => {
    const response = new _request.Response(Promise.resolve(''), {
      url: 'url/url',
      headers: new _headers.default({
        'Content-Type': 'application/octet-stream'
      })
    });
    await expect(response.decode()).resolves.toBeInstanceOf(ArrayBuffer);
  });
});