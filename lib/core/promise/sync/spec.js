"use strict";

var _sync = require("../../../core/promise/sync");
describe('core/promise/sync/memoize', () => {
  it('simple memoization', async () => {
    const promise = (0, _sync.memoize)(new Promise(r => setTimeout(r, 100)));
    await promise;
    let i = 2;
    promise.then(() => i *= 3);
    i += 1;
    expect(i).toBe(7);
  });
  it('memoization with a factory', async () => {
    const promise = (0, _sync.memoize)(() => new Promise(r => setTimeout(r, 100)));
    await promise;
    let i = 2;
    promise.then(() => i *= 3);
    i += 1;
    expect(i).toBe(7);
  });
  it('memoization by a key', async () => {
    await (0, _sync.memoize)('bla', new Promise(r => setTimeout(r, 100)));
    let i = 2;
    (0, _sync.memoize)('bla', new Promise(r => setTimeout(r, 100))).then(() => i *= 3);
    i += 1;
    expect(i).toBe(7);
  });
  it('memoization by a key and factory', async () => {
    await (0, _sync.memoize)('bla', () => new Promise(r => setTimeout(r, 100)));
    let i = 2;
    (0, _sync.memoize)('bla', () => new Promise(r => setTimeout(r, 100))).then(() => i *= 3);
    i += 1;
    expect(i).toBe(7);
  });
});