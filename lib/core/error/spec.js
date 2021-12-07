"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _error = _interopRequireDefault(require("../../core/error"));

var _testing = require("../../core/error/testing");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('BaseError', () => {
  describe('inheritance.', () => {
    it('`BaseError` is instance of `Error`', () => {
      const e = new _error.default();
      expect(e instanceof Error).toBeTrue();
    });
    it('`BaseError` is instance of itself', () => {
      const e = new _error.default();
      expect(e instanceof _error.default).toBeTrue();
    });
    it('an error derived from `BaseError` is instance of `Error`', () => {
      const e = new _testing.TestError();
      expect(e instanceof Error).toBeTrue();
    });
    it('an error derived from `BaseError` is instance of `BaseError`', () => {
      const e = new _testing.TestError();
      expect(e instanceof _error.default).toBeTrue();
    });
    it('an error derived from `BaseError` is instance of itself', () => {
      const e = new _testing.TestError();
      expect(e instanceof _testing.TestError).toBeTrue();
    });
  });
  describe('fields.', () => {
    it('`BaseError` has no enumerable fields', () => {
      const e = new _error.default();
      expect(Object.keys(e)).toEqual([]);
    });
  });
});