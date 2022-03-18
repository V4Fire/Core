"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberFractionStart = numberFractionStart;

var _const = require("../../../../../core/json/stream/parser/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Parse the buffer for the first digit in a number fraction `[0-9]`
 * and generates a token `numberChunk` with a fraction value
 */
function* numberFractionStart() {
  this.patterns.numberFracStart.lastIndex = this.index;
  this.matched = this.patterns.numberFracStart.exec(this.buffer);

  if (this.matched == null) {
    if (this.index < this.buffer.length) {
      throw new SyntaxError("Can't parse the input: expected a fractional part of a number");
    }

    return _const.PARSING_COMPLETE;
  }

  this.value = this.matched[0];
  yield {
    name: 'numberChunk',
    value: this.value
  };
  this.accumulator += this.value;
  this.expected = _const.parserStateTypes.NUMBER_FRACTION_DIGIT;
  this.index += this.value.length;
}

_const.parserStates[_const.parserStateTypes.NUMBER_FRACTION_START] = numberFractionStart;