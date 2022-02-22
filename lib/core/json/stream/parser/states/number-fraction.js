"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberFraction = numberFraction;

var _const = require("../../../../../core/json/stream/parser/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Parses the buffer for a numeric fraction symbol `[\.eE]?` and generates a token `numberChunk` with a fraction symbol
 */
function* numberFraction() {
  this.patterns.numberFraction.lastIndex = this.index;
  this.matched = this.patterns.numberFraction.exec(this.buffer);

  if (this.matched == null) {
    if (this.index < this.buffer.length) {
      this.expected = _const.parserExpected[this.parent];
      return;
    }

    return _const.PARSING_COMPLETE;
  }

  this.value = this.matched[0];
  yield {
    name: 'numberChunk',
    value: this.value
  };
  this.accumulator += this.value;
  this.expected = this.value === '.' ? _const.parserStateTypes.NUMBER_FRACTION_START : _const.parserStateTypes.NUMBER_EXP_SIGN;
  this.index += this.value.length;
}

_const.parserStates[_const.parserStateTypes.NUMBER_FRACTION] = numberFraction;