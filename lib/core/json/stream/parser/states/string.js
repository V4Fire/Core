"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.string = string;
var _const = require("../../../../../core/json/stream/parser/const");
var _helpers = require("../../../../../core/json/stream/parser/helpers");
function* string() {
  this.patterns.string.lastIndex = this.index;
  this.matched = this.patterns.string.exec(this.buffer);
  if (this.matched == null) {
    if (this.index < this.buffer.length && this.buffer.length - this.index >= 6) {
      throw new SyntaxError("Can't parse the input: escaped characters");
    }
    return _const.PARSING_COMPLETE;
  }
  this.value = this.matched[0];
  if (this.value === '"') {
    if (this.expected === _const.parserStateTypes.KEY_VAL) {
      yield {
        name: 'endKey'
      };
      yield {
        name: 'keyValue',
        value: this.accumulator
      };
      this.accumulator = '';
      this.expected = _const.parserStateTypes.COLON;
    } else {
      yield {
        name: 'endString'
      };
      yield {
        name: 'stringValue',
        value: this.accumulator
      };
      this.accumulator = '';
      this.expected = _const.parserExpected[this.parent];
    }
  } else if (this.value.length > 1 && this.value.startsWith('\\')) {
    const t = this.value.length === 2 ? _const.parserCharCodes[this.value.charAt(1)] : (0, _helpers.fromHex)(this.value);
    yield {
      name: 'stringChunk',
      value: t
    };
    this.accumulator += t;
  } else {
    yield {
      name: 'stringChunk',
      value: this.value
    };
    this.accumulator += this.value;
  }
  this.index += this.value.length;
}
_const.parserStates[_const.parserStateTypes.STRING] = string;
_const.parserStates[_const.parserStateTypes.KEY_VAL] = string;