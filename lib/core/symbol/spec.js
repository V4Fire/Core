"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _symbol = _interopRequireDefault(require("../../core/symbol"));
describe('core/symbol', () => {
  it('simple case', () => {
    const g = (0, _symbol.default)();
    expect(typeof g.foo).toBe('symbol');
    expect(g.foo).toBe(g.foo);
    expect((0, _symbol.default)().foo).not.toBe(g.foo);
  });
});