"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extend = _interopRequireDefault(require("../../../core/prelude/extend"));

var _functools = require("../../../core/functools");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * @deprecated
 * @see [[DateConstructor.getWeekDays]]
 */
(0, _extend.default)(Date, 'getWeekDays', (0, _functools.deprecate)(function getWeekDays() {
  return ['Mn', 'Ts', 'Wd', 'Th', 'Fr', 'St', 'Sn'];
}));