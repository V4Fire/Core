"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));
var _helpers = require("../../../../core/prelude/number/helpers");
(0, _extend.default)(Number.prototype, 'floor', (0, _helpers.createRoundingFunction)(Math.floor));
(0, _extend.default)(Number, 'floor', (0, _helpers.createStaticRoundingFunction)('floor'));
(0, _extend.default)(Number.prototype, 'round', (0, _helpers.createRoundingFunction)(Math.round));
(0, _extend.default)(Number, 'round', (0, _helpers.createStaticRoundingFunction)('round'));
(0, _extend.default)(Number.prototype, 'ceil', (0, _helpers.createRoundingFunction)(Math.ceil));
(0, _extend.default)(Number, 'ceil', (0, _helpers.createStaticRoundingFunction)('ceil'));