"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../core/prelude/extend"));
var _const = require("../../../core/prelude/regexp/const");
var _helpers = require("../../../core/prelude/regexp/helpers");
(0, _extend.default)(RegExp, 'escape', value => String(value).replace(_const.escapeRgxp, '\\$1'));
(0, _extend.default)(RegExp, 'test', (rgxp, str) => {
  if (Object.isString(rgxp)) {
    str = rgxp;
    return rgxp => RegExp.test(rgxp, str);
  }
  if (str == null) {
    return str => RegExp.test(rgxp, str);
  }
  if (_const.isGlobal.test(rgxp.flags)) {
    const testRgxp = _const.testCache[rgxp.source] ?? rgxp.removeFlags('g');
    _const.testCache[rgxp.source] = testRgxp;
    return testRgxp.test(str);
  }
  return rgxp.test(str);
});
(0, _extend.default)(RegExp.prototype, 'addFlags', function addFlags(...flags) {
  const set = new Set([...flags, ...this.flags].flatMap(str => str.split('')));
  return new RegExp(this.source, [...set].join(''));
});
(0, _extend.default)(RegExp, 'addFlags', (0, _helpers.createFlagsModifier)('addFlags'));
(0, _extend.default)(RegExp.prototype, 'removeFlags', function addFlags(...flags) {
  const set = new Set(flags.flatMap(str => str.split('')));
  return new RegExp(this.source, this.flags.split('').filter(flag => !set.has(flag)).join(''));
});
(0, _extend.default)(RegExp, 'removeFlags', (0, _helpers.createFlagsModifier)('removeFlags'));
(0, _extend.default)(RegExp.prototype, 'setFlags', function addFlags(...flags) {
  const set = new Set(flags.flatMap(str => str.split('')));
  return new RegExp(this.source, [...set].join(''));
});
(0, _extend.default)(RegExp, 'setFlags', (0, _helpers.createFlagsModifier)('setFlags'));