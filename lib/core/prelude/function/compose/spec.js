"use strict";

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/prelude/function/compose', () => {
  it('`compose`', () => {
    const a = v => v - 2,
          b = v => v * 4;

    expect(a.compose(b)(2)).toBe(0);
  });
  it('`compose` with promises', async () => {
    const a = v => Promise.resolve(v - 2),
          b = v => Promise.resolve(v * 4);

    expect(await a.compose(b)(2)).toBe(0);
  });
  it('`Function.compose`', () => {
    const a = v => v - 2,
          b = v => v * 4;

    expect(Function.compose(a, b)(2)).toBe(6);
  });
  it('`Function.compose` with promises', async () => {
    const a = v => Promise.resolve(v - 2),
          b = v => Promise.resolve(v * 4);

    expect(await Function.compose(a, b)(2)).toBe(6);
  });
});