"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _log = _interopRequireDefault(require("../../../core/log"));

var _extend = _interopRequireDefault(require("../../../core/prelude/extend"));

var _const = require("../../../core/prelude/global/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/** @see Any */
(0, _extend.default)(globalThis, 'Any', obj => obj);
/** @see stderr */

(0, _extend.default)(globalThis, 'stderr', err => {
  if (err instanceof Object) {
    if (_const.errorsToIgnore[err.type] === true) {
      _log.default.info('stderr', err);

      return;
    }

    _log.default.error('stderr', err);
  }
});