"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _symbol = _interopRequireDefault(require("../../core/symbol"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/symbol', () => {
  it('simple case', () => {
    const g = (0, _symbol.default)();
    expect(typeof g.foo).toBe('symbol');
    expect(g.foo).toBe(g.foo);
    expect((0, _symbol.default)().foo).not.toBe(g.foo);
  });
});