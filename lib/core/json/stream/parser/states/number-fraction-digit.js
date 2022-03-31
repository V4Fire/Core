"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberFractionDigit = numberFractionDigit;

var _const = require("../../../../../core/json/stream/parser/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Parses the buffer for number fraction digits `[0-9]` and generates a token `numberChunk` with a fraction value
 */
function* numberFractionDigit() {
  this.patterns.numberFracDigit.lastIndex = this.index;
  this.matched = this.patterns.numberFracDigit.exec(this.buffer);
  this.value = this.matched?.[0];

  if (this.value != null && this.value !== '') {
    yield {
      name: 'numberChunk',
      value: this.value
    };
    this.accumulator += this.value;
    this.index += this.value.length;
  } else {
    if (this.index < this.buffer.length) {
      this.expected = _const.parserStateTypes.NUMBER_EXPONENT;
      return;
    }

    return _const.PARSING_COMPLETE;
  }
}

_const.parserStates[_const.parserStateTypes.NUMBER_FRACTION_DIGIT] = numberFractionDigit;