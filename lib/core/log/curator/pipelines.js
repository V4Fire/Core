"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = _interopRequireDefault(require("../../../config"));

var _config2 = require("../../../core/log/config");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const pipelines = []; // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition

if (_config.default.log?.pipelines != null) {
  for (let i = 0; i < _config.default.log.pipelines.length; ++i) {
    const pipeline = (0, _config2.createPipeline)(_config.default.log.pipelines[i]);

    if (pipeline !== undefined) {
      pipelines.push(pipeline);
    }
  }
}

var _default = pipelines;
exports.default = _default;