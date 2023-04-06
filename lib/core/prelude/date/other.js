"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../core/prelude/extend"));
var _functools = require("../../../core/functools");
(0, _extend.default)(Date, 'getWeekDays', (0, _functools.deprecate)(function getWeekDays() {
  return ['Mn', 'Ts', 'Wd', 'Th', 'Fr', 'St', 'Sn'];
}));