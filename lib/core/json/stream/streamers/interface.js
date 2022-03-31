"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assembler = _interopRequireDefault(require("../../../../core/json/stream/assembler"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
class Streamer {
  /**
   * Actual depth of the streamed structure
   */
  level = 1;
  /**
   * Instance of a token assembler
   */

  /**
   * True if the streamed structure is already checked
   */
  isChecked = false;
  /**
   * Checks that specified token is matched for the streamer type
   * @param token
   */

  /**
   * @param [opts] - assembler options
   */
  constructor(opts) {
    this.assembler = new _assembler.default(opts);
  }
  /**
   * Processes the passed JSON token and yields the assembled value
   */


  *processToken(chunk) {
    if (!this.isChecked && this.checkToken(chunk)) {
      this.isChecked = true;
    }

    if (!this.isChecked) {
      return;
    }

    if (Object.isFunction(this.assembler[chunk.name])) {
      this.assembler[chunk.name](chunk.value);

      if (this.assembler.depth === this.level) {
        yield* this.push();
      }
    }
  }

}

exports.default = Streamer;