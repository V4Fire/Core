"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));

var _helpers = require("../../../../core/prelude/number/helpers");

/* eslint-disable @typescript-eslint/unbound-method */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const second = 1e3,
      minute = 60 * second,
      hour = 60 * minute,
      day = 24 * hour,
      week = 7 * day;
/** @see [[Number.second]] */

(0, _extend.default)(Number.prototype, 'second', (0, _helpers.createMsFunction)(second));
/** @see [[Number.seconds]] */

(0, _extend.default)(Number.prototype, 'seconds', Number.prototype.second);
/** @see [[NumberConstructor.second]] */

(0, _extend.default)(Number, 'seconds', (0, _helpers.createStaticMsFunction)(second));
/** @see [[Number.minute]] */

(0, _extend.default)(Number.prototype, 'minute', (0, _helpers.createMsFunction)(minute));
/** @see [[Number.minutes]] */

(0, _extend.default)(Number.prototype, 'minutes', Number.prototype.minute);
/** @see [[NumberConstructor.minutes]] */

(0, _extend.default)(Number, 'minutes', (0, _helpers.createStaticMsFunction)(minute));
/** @see [[Number.hour]] */

(0, _extend.default)(Number.prototype, 'hour', (0, _helpers.createMsFunction)(hour));
/** @see [[Number.hours]] */

(0, _extend.default)(Number.prototype, 'hours', Number.prototype.hour);
/** @see [[NumberConstructor.hours]] */

(0, _extend.default)(Number, 'hours', (0, _helpers.createStaticMsFunction)(hour));
/** @see [[Number.day]] */

(0, _extend.default)(Number.prototype, 'day', (0, _helpers.createMsFunction)(day));
/** @see [[Number.days]] */

(0, _extend.default)(Number.prototype, 'days', Number.prototype.day);
/** @see [[NumberConstructor.days]] */

(0, _extend.default)(Number, 'days', (0, _helpers.createStaticMsFunction)(day));
/** @see [[Number.week]] */

(0, _extend.default)(Number.prototype, 'week', (0, _helpers.createMsFunction)(week));
/** @see [[Number.weeks]] */

(0, _extend.default)(Number.prototype, 'weeks', Number.prototype.week);
/** @see [[NumberConstructor.weeks]] */

(0, _extend.default)(Number, 'weeks', (0, _helpers.createStaticMsFunction)(week));
/** @see [[Number.em]] */

(0, _extend.default)(Number.prototype, 'em', (0, _helpers.createStringTypeGetter)('em'));
/** @see [[Number.rem]] */

(0, _extend.default)(Number.prototype, 'rem', (0, _helpers.createStringTypeGetter)('rem'));
/** @see [[Number.px]] */

(0, _extend.default)(Number.prototype, 'px', (0, _helpers.createStringTypeGetter)('px'));
/** @see [[Number.per]] */

(0, _extend.default)(Number.prototype, 'per', (0, _helpers.createStringTypeGetter)('per'));
/** @see [[Number.vh]] */

(0, _extend.default)(Number.prototype, 'vh', (0, _helpers.createStringTypeGetter)('vh'));
/** @see [[Number.vw]] */

(0, _extend.default)(Number.prototype, 'vw', (0, _helpers.createStringTypeGetter)('vw'));
/** @see [[Number.vmin]] */

(0, _extend.default)(Number.prototype, 'vmin', (0, _helpers.createStringTypeGetter)('vmin'));
/** @see [[Number.vmax]] */

(0, _extend.default)(Number.prototype, 'vmax', (0, _helpers.createStringTypeGetter)('vmax'));