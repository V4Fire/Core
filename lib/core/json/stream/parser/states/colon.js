"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colon = colon;
var _const = require("../../../../../core/json/stream/parser/const");
function* colon() {
  this.patterns.colon.lastIndex = this.index;
  this.matched = this.patterns.colon.exec(this.buffer);
  if (this.matched == null) {
    if (this.index < this.buffer.length) {
      throw new SyntaxError("Can't parse the input: expected ':'");
    }
    return _const.PARSING_COMPLETE;
  }
  this.value = this.matched[0];
  if (this.value === ':') {
    this.expected = _const.parserStateTypes.VALUE;
  }
  this.index += this.value.length;
}
_const.parserStates[_const.parserStateTypes.COLON] = colon;