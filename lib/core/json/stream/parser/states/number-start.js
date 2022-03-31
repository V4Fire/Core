"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberStart = numberStart;

var _const = require("../../../../../core/json/stream/parser/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Parses the buffer for number digits `[0-9]` and generates a token `numberChunk` with a number
 */
function* numberStart() {
  this.patterns.numberStart.lastIndex = this.index;
  this.matched = this.patterns.numberStart.exec(this.buffer);

  if (this.matched == null) {
    if (this.index < this.buffer.length) {
      throw new SyntaxError("Can't parse the input: expected a starting digit");
    }

    return _const.PARSING_COMPLETE;
  }

  this.value = this.matched[0];
  yield {
    name: 'numberChunk',
    value: this.value
  };
  this.accumulator += this.value;
  this.expected = this.value === '0' ? _const.parserStateTypes.NUMBER_FRACTION : _const.parserStateTypes.NUMBER_DIGIT;
  this.index += this.value.length;
}

_const.parserStates[_const.parserStateTypes.NUMBER_START] = numberStart;