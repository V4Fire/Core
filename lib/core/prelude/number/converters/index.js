"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));
var _helpers = require("../../../../core/prelude/number/helpers");
const second = 1e3,
  minute = 60 * second,
  hour = 60 * minute,
  day = 24 * hour,
  week = 7 * day;
(0, _extend.default)(Number.prototype, 'second', (0, _helpers.createMsFunction)(second));
(0, _extend.default)(Number.prototype, 'seconds', Number.prototype.second);
(0, _extend.default)(Number, 'seconds', (0, _helpers.createStaticMsFunction)(second));
(0, _extend.default)(Number.prototype, 'minute', (0, _helpers.createMsFunction)(minute));
(0, _extend.default)(Number.prototype, 'minutes', Number.prototype.minute);
(0, _extend.default)(Number, 'minutes', (0, _helpers.createStaticMsFunction)(minute));
(0, _extend.default)(Number.prototype, 'hour', (0, _helpers.createMsFunction)(hour));
(0, _extend.default)(Number.prototype, 'hours', Number.prototype.hour);
(0, _extend.default)(Number, 'hours', (0, _helpers.createStaticMsFunction)(hour));
(0, _extend.default)(Number.prototype, 'day', (0, _helpers.createMsFunction)(day));
(0, _extend.default)(Number.prototype, 'days', Number.prototype.day);
(0, _extend.default)(Number, 'days', (0, _helpers.createStaticMsFunction)(day));
(0, _extend.default)(Number.prototype, 'week', (0, _helpers.createMsFunction)(week));
(0, _extend.default)(Number.prototype, 'weeks', Number.prototype.week);
(0, _extend.default)(Number, 'weeks', (0, _helpers.createStaticMsFunction)(week));
(0, _extend.default)(Number.prototype, 'em', (0, _helpers.createStringTypeGetter)('em'));
(0, _extend.default)(Number.prototype, 'rem', (0, _helpers.createStringTypeGetter)('rem'));
(0, _extend.default)(Number.prototype, 'px', (0, _helpers.createStringTypeGetter)('px'));
(0, _extend.default)(Number.prototype, 'per', (0, _helpers.createStringTypeGetter)('per'));
(0, _extend.default)(Number.prototype, 'vh', (0, _helpers.createStringTypeGetter)('vh'));
(0, _extend.default)(Number.prototype, 'vw', (0, _helpers.createStringTypeGetter)('vw'));
(0, _extend.default)(Number.prototype, 'vmin', (0, _helpers.createStringTypeGetter)('vmin'));
(0, _extend.default)(Number.prototype, 'vmax', (0, _helpers.createStringTypeGetter)('vmax'));