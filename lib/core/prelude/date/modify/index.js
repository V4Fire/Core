"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));
var _helpers = require("../../../../core/prelude/date/helpers");
(0, _extend.default)(Date.prototype, 'add', (0, _helpers.createDateModifier)((v, b) => b + v));
(0, _extend.default)(Date, 'add', (0, _helpers.createStaticDateModifier)('add'));
(0, _extend.default)(Date.prototype, 'set', (0, _helpers.createDateModifier)());
(0, _extend.default)(Date, 'set', (0, _helpers.createStaticDateModifier)('set'));
(0, _extend.default)(Date.prototype, 'rewind', (0, _helpers.createDateModifier)((v, b) => b - v));
(0, _extend.default)(Date, 'rewind', (0, _helpers.createStaticDateModifier)('rewind'));