"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberFractionDigit = numberFractionDigit;
var _const = require("../../../../../core/json/stream/parser/const");
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