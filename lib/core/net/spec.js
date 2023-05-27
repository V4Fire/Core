"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _config = _interopRequireDefault(require("../../config"));
var _net = require("../../core/net");
describe('core/net', () => {
  const originalURL = _config.default.online.checkURL;
  it('`isOnline`', async () => {
    _config.default.online.checkURL = 'https://google.com/favicon.ico';
    expect(await (0, _net.isOnline)()).toEqual({
      status: true,
      lastOnline: undefined
    });
    _config.default.online.checkURL = '';
    expect(await (0, _net.isOnline)()).toEqual({
      status: true,
      lastOnline: undefined
    });
    _config.default.online.checkURL = originalURL;
  });
});