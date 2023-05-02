"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _async = _interopRequireDefault(require("../../../../core/async"));
var _sync = _interopRequireDefault(require("../../../../core/promise/sync"));
describe('core/async/modules/proxy `iterable`', () => {
  let $a, asyncIterator;
  beforeEach(() => {
    $a = new _async.default();
    asyncIterator = {
      async *[Symbol.asyncIterator]() {
        for (const el of [1, 2, 3, 4]) {
          await new Promise(r => setTimeout(r, 100));
          yield el;
        }
      }
    };
  });
  describe('wraps a synchronous iterable object', () => {
    it('using for await', async () => {
      const iter = $a.iterable([1, 2, 3, 4]);
      let i = 0;
      for await (const item of iter) {
        i++;
        expect(item).toEqual(i);
      }
    });
    it('manual invoking of `next`', async () => {
      const asyncIter = $a.iterable([1, 2, 3])[Symbol.asyncIterator]();
      expect(await asyncIter.next()).toEqual({
        done: false,
        value: 1
      });
    });
  });
  describe('wraps an asynchronous iterable object', () => {
    beforeEach(() => {
      $a = new _async.default();
    });
    it('manual invoking of `next`', async () => {
      const asyncIter = $a.iterable(asyncIterator)[Symbol.asyncIterator]();
      expect(await asyncIter.next()).toEqual({
        done: false,
        value: 1
      });
    });
    it('cancellation of the iteration', async () => {
      const iterable = $a.iterable(asyncIterator),
        asyncIter = iterable[Symbol.asyncIterator]();
      expect(await asyncIter.next()).toEqual({
        done: false,
        value: 1
      });
      const promise1 = asyncIter.next();
      $a.cancelIterable(iterable);
      await expect(promise1).rejects.toBeTruthy();
      const promise2 = asyncIter.next();
      await expect(promise2).rejects.toBeTruthy();
    });
    it('suspending/unsuspending of the iteration', async () => {
      const iterable = $a.iterable(asyncIterator),
        asyncIter = iterable[Symbol.asyncIterator]();
      expect(await asyncIter.next()).toEqual({
        done: false,
        value: 1
      });
      const nextIter = asyncIter.next();
      $a.suspendIterable(iterable);
      await $a.sleep(200);
      await expectToBePending(nextIter);
      $a.unsuspendIterable(iterable);
      expect(await nextIter).toEqual({
        done: false,
        value: 2
      });
    });
    it('muting/unmuting of the iteration', async () => {
      const iterable = $a.iterable(asyncIterator),
        asyncIter = iterable[Symbol.asyncIterator]();
      expect(await asyncIter.next()).toEqual({
        done: false,
        value: 1
      });
      const nextIter = asyncIter.next();
      $a.muteIterable(iterable);
      await $a.sleep(150);
      await expectToBePending(nextIter);
      $a.unmuteIterable(iterable);
      expect(await nextIter).toEqual({
        done: false,
        value: 3
      });
    });
  });
});
function expectToBePending(promise) {
  const want = {};
  return _sync.default.race([promise, _sync.default.resolve(want)]).then(val => {
    expect(val).toEqual(want);
  });
}