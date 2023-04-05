"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberStart = numberStart;
var _const = require("../../../../../core/json/stream/parser/const");
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