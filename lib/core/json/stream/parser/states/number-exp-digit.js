"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberExpDigit = numberExpDigit;

var _const = require("../../../../../core/json/stream/parser/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Parses the buffer for a digit expression `[0-9]*` and generates a token `numberChunk` with a number value
 */
function* numberExpDigit() {
  this.patterns.numberExpDigit.lastIndex = this.index;
  this.matched = this.patterns.numberExpDigit.exec(this.buffer);
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
      this.expected = _const.parserExpected[this.parent];
      return;
    }

    return _const.PARSING_COMPLETE;
  }
}

_const.parserStates[_const.parserStateTypes.NUMBER_EXP_DIGIT] = numberExpDigit;