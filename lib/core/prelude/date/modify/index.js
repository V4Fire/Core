"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));

var _helpers = require("../../../../core/prelude/date/helpers");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/** @see [[Date.add]] */
(0, _extend.default)(Date.prototype, 'add', (0, _helpers.createDateModifier)((v, b) => b + v));
/** @see [[DateConstructor.add]] */

(0, _extend.default)(Date, 'add', (0, _helpers.createStaticDateModifier)('add'));
/** @see [[Date.set]] */

(0, _extend.default)(Date.prototype, 'set', (0, _helpers.createDateModifier)());
/** @see [[DateConstructor.set]] */

(0, _extend.default)(Date, 'set', (0, _helpers.createStaticDateModifier)('set'));
/** @see [[Date.rewind]] */

(0, _extend.default)(Date.prototype, 'rewind', (0, _helpers.createDateModifier)((v, b) => b - v));
/** @see [[DateConstructor.rewind]] */

(0, _extend.default)(Date, 'rewind', (0, _helpers.createStaticDateModifier)('rewind'));