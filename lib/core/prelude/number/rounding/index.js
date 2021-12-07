"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));

var _helpers = require("../../../../core/prelude/number/helpers");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/** @see [[Number.floor]] */
(0, _extend.default)(Number.prototype, 'floor', (0, _helpers.createRoundingFunction)(Math.floor));
/** @see [[NumberConstructor.floor]] */

(0, _extend.default)(Number, 'floor', (0, _helpers.createStaticRoundingFunction)('floor'));
/** @see [[Number.round]] */

(0, _extend.default)(Number.prototype, 'round', (0, _helpers.createRoundingFunction)(Math.round));
/** @see [[NumberConstructor.round]] */

(0, _extend.default)(Number, 'round', (0, _helpers.createStaticRoundingFunction)('round'));
/** @see [[Number.ceil]] */

(0, _extend.default)(Number.prototype, 'ceil', (0, _helpers.createRoundingFunction)(Math.ceil));
/** @see [[NumberConstructor.round]] */

(0, _extend.default)(Number, 'ceil', (0, _helpers.createStaticRoundingFunction)('ceil'));