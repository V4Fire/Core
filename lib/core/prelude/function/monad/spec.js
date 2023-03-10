"use strict";

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/prelude/function/monad', () => {
  it('`option`', async () => {
    const square = (n => n * n).option();

    expect(await square(2)).toBe(4);
    expect(await square(square(2))).toBe(16);
    expect(await square(square.result()(2))).toBe(16);
    expect(await square(null).catch(e => e)).toBe(null);
    expect(await square(undefined).catch(e => e)).toBe(null);
    expect(await square(square(null)).catch(e => e)).toBe(null);
  });
  it('`Object.Option`', async () => {
    const square = Object.Option(n => n * n);
    expect(await square(2)).toBe(4);
    expect(await square(square(2))).toBe(16);
    expect(await square(square.result()(2))).toBe(16);
    expect(await square(Object.Option(2))).toBe(4);
    expect(await square(Object.Result(2))).toBe(4);
    expect(await square(null).catch(e => e)).toBe(null);
    expect(await square(undefined).catch(e => e)).toBe(null);
    expect(await square(square(null)).catch(e => e)).toBe(null);
    expect(await Object.Option(null).catch(e => e)).toBe(null);
  });
  it('`result`', async () => {
    const square = n => n * n,
          call = ((f, ...args) => f(...args)).result(),
          read = (v => v).result();

    expect(await call(square, 2)).toBe(4);
    expect(await read(call(square, 2))).toBe(4);
    expect(await read(call.option()(square, 2))).toBe(4);
    expect(await call(null).catch(e => Object.isString(e.message))).toBe(true);
    expect(await call(undefined).catch(e => Object.isString(e.message))).toBe(true);
    expect(await call(call(null)).catch(e => Object.isString(e.message))).toBe(true);
  });
  it('`Object.Result`', async () => {
    const square = n => n * n,
          call = Object.Result((f, ...args) => f(...args)),
          read = Object.Result(v => v);

    expect(await call(square, 2)).toBe(4);
    expect(await read(call(square, 2))).toBe(4);
    expect(await read(Object.Option(call)(square, 2))).toBe(4);
    expect(await call(null).catch(e => Object.isString(e.message))).toBe(true);
    expect(await call(undefined).catch(e => Object.isString(e.message))).toBe(true);
    expect(await call(call(null)).catch(e => Object.isString(e.message))).toBe(true);
    expect(await Object.Result(new Error('boom')).catch(e => e.message)).toBe('boom');
  });
});