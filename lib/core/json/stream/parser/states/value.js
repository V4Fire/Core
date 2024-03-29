"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.value = value;
var _const = require("../../../../../core/json/stream/parser/const");
function* value() {
  this.patterns.value1.lastIndex = this.index;
  this.matched = this.patterns.value1.exec(this.buffer);
  if (this.matched == null) {
    if (this.index + _const.MAX_PATTERN_SIZE < this.buffer.length) {
      if (this.index < this.buffer.length) {
        throw new SyntaxError("Can't parse the input: expected a value");
      }
      throw new SyntaxError('The parser has expected a value');
    }
    return _const.PARSING_COMPLETE;
  }
  this.value = this.matched[0];
  switch (this.value) {
    case '"':
      yield {
        name: 'startString'
      };
      this.expected = _const.parserStateTypes.STRING;
      break;
    case '{':
      yield {
        name: 'startObject'
      };
      this.stack.push(this.parent);
      this.parent = _const.parserStateTypes.OBJECT;
      this.expected = _const.parserStateTypes.KEY1;
      break;
    case '[':
      yield {
        name: 'startArray'
      };
      this.stack.push(this.parent);
      this.parent = _const.parserStateTypes.ARRAY;
      this.expected = _const.parserStateTypes.VALUE1;
      break;
    case ']':
      if (this.expected !== _const.parserStateTypes.VALUE1) {
        throw new SyntaxError("Parser cannot parse input: unexpected token ']'");
      }
      if (this.isOpenNumber) {
        yield {
          name: 'endNumber'
        };
        yield {
          name: 'numberValue',
          value: this.accumulator
        };
        this.isOpenNumber = false;
        this.accumulator = '';
      }
      yield {
        name: 'endArray'
      };
      this.parent = this.stack.pop();
      this.expected = _const.parserExpected[this.parent];
      break;
    case '-':
      this.isOpenNumber = true;
      yield {
        name: 'startNumber'
      };
      yield {
        name: 'numberChunk',
        value: '-'
      };
      this.accumulator = '-';
      this.expected = _const.parserStateTypes.NUMBER_START;
      break;
    case '0':
      this.isOpenNumber = true;
      yield {
        name: 'startNumber'
      };
      yield {
        name: 'numberChunk',
        value: '0'
      };
      this.accumulator = '0';
      this.expected = _const.parserStateTypes.NUMBER_FRACTION;
      break;
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      this.isOpenNumber = true;
      yield {
        name: 'startNumber'
      };
      yield {
        name: 'numberChunk',
        value: this.value
      };
      this.accumulator = this.value;
      this.expected = _const.parserStateTypes.NUMBER_DIGIT;
      break;
    case 'true':
    case 'false':
    case 'null':
      yield {
        name: `${this.value}Value`,
        value: Object.parse(this.value)
      };
      this.expected = _const.parserExpected[this.parent];
      break;
    default:
  }
  this.index += this.value.length;
}
_const.parserStates[_const.parserStateTypes.VALUE] = value;
_const.parserStates[_const.parserStateTypes.VALUE1] = value;