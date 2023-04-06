"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberDigit = numberDigit;
var _const = require("../../../../../core/json/stream/parser/const");
function* numberDigit() {
  this.patterns.numberDigit.lastIndex = this.index;
  this.matched = this.patterns.numberDigit.exec(this.buffer);
  if (this.matched == null) {
    if (this.index < this.buffer.length) {
      throw new SyntaxError("Can't parse the input: expected a digit");
    }
    return _const.PARSING_COMPLETE;
  }
  this.value = this.matched[0];
  if (this.value.length > 0) {
    yield {
      name: 'numberChunk',
      value: this.value
    };
    this.accumulator += this.value;
    this.index += this.value.length;
  } else {
    if (this.index < this.buffer.length) {
      this.expected = _const.parserStateTypes.NUMBER_FRACTION;
      return;
    }
    return _const.PARSING_COMPLETE;
  }
}
_const.parserStates[_const.parserStateTypes.NUMBER_DIGIT] = numberDigit;