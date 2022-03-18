"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _interface = _interopRequireDefault(require("../../../../core/json/stream/streamers/interface"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
class StreamObject extends _interface.default {
  /**
   * Last key of the current streamed object property
   */
  key = null;

  constructor(opts) {
    super(opts);
  }
  /** @inheritDoc */


  checkToken(chunk) {
    if (chunk.name !== 'startObject') {
      throw new TypeError('The top-level object should be an object');
    }

    return true;
  }
  /** @inheritDoc */


  *push() {
    const {
      key,
      value
    } = this.assembler;

    if (this.key == null) {
      this.key = key;
    } else if (Object.isDictionary(value)) {
      yield {
        key: this.key,
        value: Object.cast(value[this.key])
      };
      this.key = null;
      this.assembler.value = {};
    }
  }

}

exports.default = StreamObject;