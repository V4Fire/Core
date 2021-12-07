"use strict";

var _semver = _interopRequireWildcard(require("../../core/semver"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/semver', () => {
  it('greater than (>)', () => {
    expect((0, _semver.default)('1.1.1', '2.1.1', '>')).toBeFalse();
    expect((0, _semver.default)('1.1.1', '1.2.1', '>')).toBeFalse();
    expect((0, _semver.default)('1.1.1', '1.1.2', '>')).toBeFalse();
    expect((0, _semver.default)('1.1.2', '2.1.1', '>')).toBeFalse();
    expect((0, _semver.default)('1.1.2', '1.2.1', '>')).toBeFalse();
    expect((0, _semver.default)('1.1.3', '2.1.1', '>')).toBeFalse();
    expect((0, _semver.default)('1.1.3', '1.2.1', '>')).toBeFalse();
    expect((0, _semver.default)('1.2.1', '2.1.1', '>')).toBeFalse();
    expect((0, _semver.default)('1.3.1', '2.1.1', '>')).toBeFalse();
    expect((0, _semver.default)('2.1.1', '1.1.1', '>')).toBeTrue();
    expect((0, _semver.default)('1.2.1', '1.1.1', '>')).toBeTrue();
    expect((0, _semver.default)('1.1.2', '1.1.1', '>')).toBeTrue();
    expect((0, _semver.default)('2.1.1', '1.1.2', '>')).toBeTrue();
    expect((0, _semver.default)('1.2.1', '1.1.2', '>')).toBeTrue();
    expect((0, _semver.default)('2.1.1', '1.1.3', '>')).toBeTrue();
    expect((0, _semver.default)('1.2.1', '1.1.3', '>')).toBeTrue();
    expect((0, _semver.default)('2.1.1', '1.2.1', '>')).toBeTrue();
    expect((0, _semver.default)('2.1.1', '1.3.1', '>')).toBeTrue();
    expect((0, _semver.default)('1.1.2', '1.1.2', '>')).toBeFalse();
    expect((0, _semver.default)('1.0.0', '1.2.7', '>')).toBeFalse();
    expect((0, _semver.default)('1.*', '1.2.7', '>')).toBeFalse();
    expect((0, _semver.default)('1.3.0', '1.2.*', '>')).toBeTrue();
    expect((0, _semver.default)('1.2.*', '1.3.0', '>')).toBeFalse();
    expect((0, _semver.default)('1.2.7', '1.*', '>')).toBeFalse();
    expect((0, _semver.default)('1.2.4', '1.2.*', '>')).toBeFalse();
  });
  it('greater than or equal (>=)', () => {
    expect((0, _semver.default)('1.1.1', '2.1.1', '>=')).toBeFalse();
    expect((0, _semver.default)('1.1.1', '1.2.1', '>=')).toBeFalse();
    expect((0, _semver.default)('1.1.1', '1.1.2', '>=')).toBeFalse();
    expect((0, _semver.default)('1.1.2', '2.1.1', '>=')).toBeFalse();
    expect((0, _semver.default)('1.1.2', '1.2.1', '>=')).toBeFalse();
    expect((0, _semver.default)('1.1.3', '2.1.1', '>=')).toBeFalse();
    expect((0, _semver.default)('1.1.3', '1.2.1', '>=')).toBeFalse();
    expect((0, _semver.default)('1.2.1', '2.1.1', '>=')).toBeFalse();
    expect((0, _semver.default)('1.3.1', '2.1.1', '>=')).toBeFalse();
    expect((0, _semver.default)('2.1.1', '1.1.1', '>=')).toBeTrue();
    expect((0, _semver.default)('1.2.1', '1.1.1', '>=')).toBeTrue();
    expect((0, _semver.default)('1.1.2', '1.1.1', '>=')).toBeTrue();
    expect((0, _semver.default)('2.1.1', '1.1.2', '>=')).toBeTrue();
    expect((0, _semver.default)('1.2.1', '1.1.2', '>=')).toBeTrue();
    expect((0, _semver.default)('2.1.1', '1.1.3', '>=')).toBeTrue();
    expect((0, _semver.default)('1.2.1', '1.1.3', '>=')).toBeTrue();
    expect((0, _semver.default)('2.1.1', '1.2.1', '>=')).toBeTrue();
    expect((0, _semver.default)('2.1.1', '1.3.1', '>=')).toBeTrue();
    expect((0, _semver.default)('1.1.2', '1.1.2', '>=')).toBeTrue();
    expect((0, _semver.default)('1.*', '1.2.7', '>=')).toBeTrue();
    expect((0, _semver.default)('1.3.0', '1.2.*', '>=')).toBeTrue();
    expect((0, _semver.default)('1.2.*', '1.3.0', '>=')).toBeFalse();
    expect((0, _semver.default)('1.2.7', '1.*', '>=')).toBeTrue();
    expect((0, _semver.default)('1.2.4', '1.2.*', '>=')).toBeTrue();
  });
  it('less than (<)', () => {
    expect((0, _semver.default)('1.1.1', '2.1.1', '<')).toBeTrue();
    expect((0, _semver.default)('1.1.1', '1.2.1', '<')).toBeTrue();
    expect((0, _semver.default)('1.1.1', '1.1.2', '<')).toBeTrue();
    expect((0, _semver.default)('1.1.2', '2.1.1', '<')).toBeTrue();
    expect((0, _semver.default)('1.1.2', '1.2.1', '<')).toBeTrue();
    expect((0, _semver.default)('1.1.3', '2.1.1', '<')).toBeTrue();
    expect((0, _semver.default)('1.1.3', '1.2.1', '<')).toBeTrue();
    expect((0, _semver.default)('1.2.1', '2.1.1', '<')).toBeTrue();
    expect((0, _semver.default)('1.3.1', '2.1.1', '<')).toBeTrue();
    expect((0, _semver.default)('2.1.1', '1.1.1', '<')).toBeFalse();
    expect((0, _semver.default)('1.2.1', '1.1.1', '<')).toBeFalse();
    expect((0, _semver.default)('1.1.2', '1.1.1', '<')).toBeFalse();
    expect((0, _semver.default)('2.1.1', '1.1.2', '<')).toBeFalse();
    expect((0, _semver.default)('1.2.1', '1.1.2', '<')).toBeFalse();
    expect((0, _semver.default)('2.1.1', '1.1.3', '<')).toBeFalse();
    expect((0, _semver.default)('1.2.1', '1.1.3', '<')).toBeFalse();
    expect((0, _semver.default)('2.1.1', '1.2.1', '<')).toBeFalse();
    expect((0, _semver.default)('2.1.1', '1.3.1', '<')).toBeFalse();
    expect((0, _semver.default)('1.1.2', '1.1.2', '<')).toBeFalse();
    expect((0, _semver.default)('1.0.0', '1.2.7', '<')).toBeTrue();
    expect((0, _semver.default)('1.*', '1.2.7', '<')).toBeFalse();
    expect((0, _semver.default)('1.3.0', '1.2.*', '<')).toBeFalse();
    expect((0, _semver.default)('1.2.7', '1.*', '<')).toBeFalse();
    expect((0, _semver.default)('1.2.4', '1.2.*', '<')).toBeFalse();
  });
  it('less than or equal (<=)', () => {
    expect((0, _semver.default)('1.1.1', '2.1.1', '<=')).toBeTrue();
    expect((0, _semver.default)('1.1.1', '1.2.1', '<=')).toBeTrue();
    expect((0, _semver.default)('1.1.1', '1.1.2', '<=')).toBeTrue();
    expect((0, _semver.default)('1.1.2', '2.1.1', '<=')).toBeTrue();
    expect((0, _semver.default)('1.1.2', '1.2.1', '<=')).toBeTrue();
    expect((0, _semver.default)('1.1.3', '2.1.1', '<=')).toBeTrue();
    expect((0, _semver.default)('1.1.3', '1.2.1', '<=')).toBeTrue();
    expect((0, _semver.default)('1.2.1', '2.1.1', '<=')).toBeTrue();
    expect((0, _semver.default)('1.3.1', '2.1.1', '<=')).toBeTrue();
    expect((0, _semver.default)('2.1.1', '1.1.1', '<=')).toBeFalse();
    expect((0, _semver.default)('1.2.1', '1.1.1', '<=')).toBeFalse();
    expect((0, _semver.default)('1.1.2', '1.1.1', '<=')).toBeFalse();
    expect((0, _semver.default)('2.1.1', '1.1.2', '<=')).toBeFalse();
    expect((0, _semver.default)('1.2.1', '1.1.2', '<=')).toBeFalse();
    expect((0, _semver.default)('2.1.1', '1.1.3', '<=')).toBeFalse();
    expect((0, _semver.default)('1.2.1', '1.1.3', '<=')).toBeFalse();
    expect((0, _semver.default)('2.1.1', '1.2.1', '<=')).toBeFalse();
    expect((0, _semver.default)('2.1.1', '1.3.1', '<=')).toBeFalse();
    expect((0, _semver.default)('1.1.2', '1.1.2', '<=')).toBeTrue();
    expect((0, _semver.default)('1.3.0', '1.2.*', '<=')).toBeFalse();
    expect((0, _semver.default)('1.0.0', '1.2.7', '<=')).toBeTrue();
    expect((0, _semver.default)('1.*', '1.2.7', '<=')).toBeTrue();
    expect((0, _semver.default)('1.3.*', '1.2.*', '<=')).toBeFalse();
    expect((0, _semver.default)('1.2.7', '1.*', '<=')).toBeTrue();
    expect((0, _semver.default)('1.2.4', '1.2.*', '<=')).toBeTrue();
  });
  it('equal (==)', () => {
    expect((0, _semver.default)('1.3.0', '1.2.*', '==')).toBeFalse();
    expect((0, _semver.default)('1.2.9', '1.2.7', '==')).toBeFalse();
    expect((0, _semver.default)('1.2.9', '1.2.9', '==')).toBeTrue();
    expect((0, _semver.default)('1.0.0', '1.2.7', '==')).toBeFalse();
    expect((0, _semver.default)('1', '1.2.7', '==')).toBeTrue();
    expect((0, _semver.default)('1.*', '1.2.7', '==')).toBeTrue();
    expect((0, _semver.default)('1.2.7', '1.*', '==')).toBeTrue();
    expect((0, _semver.default)('1.2.4', '1.2.*', '==')).toBeTrue();
  });
  it('caret range', () => {
    expect((0, _semver.default)('0.8.3', '0.9.0', '^=')).toBeFalse();
    expect((0, _semver.default)('0.0.1', '0.0.2', '^=')).toBeFalse();
    expect((0, _semver.default)('2.1.0', '1.2.3', '^=')).toBeFalse();
    expect((0, _semver.default)('1.2', '2.0', '^=')).toBeFalse();
    expect((0, _semver.default)('1', '1.0.0', '^=')).toBeTrue();
    expect((0, _semver.default)('2', '2.2.10', '^=')).toBeTrue();
    expect((0, _semver.default)('3', '2.0.0', '^=')).toBeFalse();
    expect((0, _semver.default)('5', '6', '^=')).toBeFalse();
  });
  it('tilda range', () => {
    expect((0, _semver.default)('0.8.3', '0.9.0', '~=')).toBeFalse();
    expect((0, _semver.default)('0.0.1', '0.0.2', '~=')).toBeFalse();
    expect((0, _semver.default)('2.0.2', '1.0.1', '~=')).toBeFalse();
    expect((0, _semver.default)('0.0.2', '0.0.1', '~=')).toBeTrue();
    expect((0, _semver.default)('1.2.4', '1.2.3', '~=')).toBeTrue();
    expect((0, _semver.default)('1.5.2', '1', '~=')).toBeTrue();
  });
  it('caret range with x-range', () => {
    expect((0, _semver.default)('*', '0.0.2', '^=')).toBeTrue();
    expect((0, _semver.default)('1.*', '0.0.5', '^=')).toBeFalse();
    expect((0, _semver.default)('1.*', '1.0.2', '^=')).toBeTrue();
    expect((0, _semver.default)('1.*', '1.2.3', '^=')).toBeTrue();
    expect((0, _semver.default)('1.2.*', '2.0.0', '^=')).toBeFalse();
    expect((0, _semver.default)('1.2.*', '2.0.0', '^=')).toBeFalse();
    expect((0, _semver.default)('1.2.3', '2.*', '^=')).toBeFalse();
    expect((0, _semver.default)('1.2.3', '1.*', '^=')).toBeTrue();
    expect((0, _semver.default)('2', '1.*', '^=')).toBeFalse();
  });
  it('expect error', () => {
    expect(() => (0, _semver.default)(' ', '0.0.2', '^=')).toThrowError(_semver.operandLengthErrorText);
    expect(() => (0, _semver.default)('', '2.0.0', '^=')).toThrowError(_semver.operandLengthErrorText);
    expect(() => (0, _semver.default)('2.0.0', '', '^=')).toThrowError(_semver.operandLengthErrorText);
    expect(() => (0, _semver.default)('', '', '^=')).toThrowError(_semver.operandLengthErrorText);
  });
});