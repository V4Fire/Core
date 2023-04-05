"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.done = done;
var _const = require("../../../../../core/json/stream/parser/const");
function* done() {
  this.patterns.ws.lastIndex = this.index;
  this.matched = this.patterns.ws.exec(this.buffer);
  if (this.isOpenNumber) {
    yield {
      name: 'endNumber'
    };
    this.isOpenNumber = false;
    yield {
      name: 'numberValue',
      value: this.accumulator
    };
    this.accumulator = '';
  }
  if (this.matched == null) {
    if (this.index < this.buffer.length) {
      throw new SyntaxError("Can't parse the input: unexpected characters");
    }
    return _const.PARSING_COMPLETE;
  }
  this.value = this.matched[0];
  this.index += this.value.length;
}
_const.parserStates[_const.parserStateTypes.DONE] = done;