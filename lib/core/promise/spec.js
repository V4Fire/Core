"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _sync = _interopRequireDefault(require("../../core/promise/sync"));

var _abortable = _interopRequireDefault(require("../../core/promise/abortable"));

var _promise = require("../../core/promise");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/promise', () => {
  describe('`createControllablePromise`', () => {
    it('should provide a method to resolve', async () => {
      const promise = (0, _promise.createControllablePromise)();
      expect(await promise.resolve(10)).toBe(10);
    });
    it('should provide a method to reject', async () => {
      const promise = (0, _promise.createControllablePromise)();
      expect(await promise.reject('Boom!').catch(msg => msg)).toBe('Boom!');
    });
    it('should provide a getter to check if the promise is pending', () => {
      const promise = (0, _promise.createControllablePromise)();
      expect(promise.isPending).toBeTrue();
      promise.resolve(10);
      expect(promise.isPending).toBeFalse();
    });
    it('providing a custom promise constructor', () => {
      const promise = (0, _promise.createControllablePromise)({
        type: _sync.default
      });
      let res;
      promise.resolve(10).then(val => {
        res = val;
      });
      expect(res).toBe(10);
    });
    it('providing a custom promise executor', async () => {
      const promise = (0, _promise.createControllablePromise)({
        executor: resolve => resolve(5)
      });
      expect(await promise.resolve(10)).toBe(5);
    });
    it('providing a custom promise constructor and executor', async () => {
      let res;
      const promise = (0, _promise.createControllablePromise)({
        type: _abortable.default,
        executor: (resolve, reject, onAbort) => {
          onAbort(reason => {
            res = reason;
          });
        }
      });

      try {
        promise.abort('Boom!');
        await promise;
      } catch {}

      expect(res).toBe('Boom!');
    });
    it('providing a custom promise constructor and extra arguments', async () => {
      const parent = _abortable.default.reject('Boom!');

      parent.catch(() => {// Do nothing
      });
      const promise = (0, _promise.createControllablePromise)({
        type: _abortable.default,
        args: [parent]
      });
      let res;

      try {
        await promise.resolve(10);
      } catch (err) {
        res = err;
      }

      expect(res).toBe('Boom!');
    });
  });
  describe('`isControllablePromise`', () => {
    it('should return true for controllable promises', () => {
      expect((0, _promise.isControllablePromise)((0, _promise.createControllablePromise)())).toBeTrue();
      expect((0, _promise.isControllablePromise)((0, _promise.createControllablePromise)({
        type: _abortable.default
      }))).toBeTrue();
    });
    it('should return false for non-controllable promises or non-promise values', () => {
      expect((0, _promise.isControllablePromise)(Promise.resolve(1))).toBeFalse();
      expect((0, _promise.isControllablePromise)(_abortable.default.resolve(1))).toBeFalse();
      expect((0, _promise.isControllablePromise)(1)).toBeFalse();
    });
  });
});