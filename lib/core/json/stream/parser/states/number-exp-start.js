"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberExpStart = numberExpStart;
var _const = require("../../../../../core/json/stream/parser/const");
function* numberExpStart() {
  this.patterns.numberExpStart.lastIndex = this.index;
  this.matched = this.patterns.numberExpStart.exec(this.buffer);
  if (this.matched == null) {
    if (this.index < this.buffer.length) {
      throw new SyntaxError("Can't parse the input: expected an exponent part of a number");
    }
    return _const.PARSING_COMPLETE;
  }
  this.value = this.matched[0];
  yield {
    name: 'numberChunk',
    value: this.value
  };
  this.accumulator += this.value;
  this.expected = _const.parserStateTypes.NUMBER_EXP_DIGIT;
  this.index += this.value.length;
}
_const.parserStates[_const.parserStateTypes.NUMBER_EXP_START] = numberExpStart;