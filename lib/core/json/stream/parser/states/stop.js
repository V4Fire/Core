"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stop = stop;

var _const = require("../../../../../core/json/stream/parser/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Parses the buffer for the end of the current structure (an object or array) and
 * generates tokens `endObject` or `endArray`
 */
function* stop() {
  this.patterns.comma.lastIndex = this.index;
  this.matched = this.patterns.comma.exec(this.buffer);

  if (this.matched == null) {
    if (this.index < this.buffer.length) {
      throw new SyntaxError("Parser cannot parse input: expected ','");
    }

    return _const.PARSING_COMPLETE;
  }

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

  this.value = this.matched[0];

  if (this.value === ',') {
    this.expected = this.expected === _const.parserStateTypes.ARRAY_STOP ? _const.parserStateTypes.VALUE : 'key';
  } else if (this.value === '}' || this.value === ']') {
    yield {
      name: this.value === '}' ? 'endObject' : 'endArray'
    };
    this.parent = this.stack.pop();
    this.expected = _const.parserExpected[this.parent];
  }

  this.index += this.value.length;
}

_const.parserStates[_const.parserStateTypes.ARRAY_STOP] = stop;
_const.parserStates[_const.parserStateTypes.OBJECT_STOP] = stop;