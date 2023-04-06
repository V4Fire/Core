"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberExpDigit = numberExpDigit;
var _const = require("../../../../../core/json/stream/parser/const");
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