"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.key = key;

var _const = require("../../../../../core/json/stream/parser/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Parses the buffer for an object key and generates a token `startKey`.
 * Or if the object ended generates `endObject` token.
 */
function* key() {
  this.patterns.key1.lastIndex = this.index;
  this.matched = this.patterns.key1.exec(this.buffer);

  if (this.matched == null) {
    if (this.index < this.buffer.length) {
      throw new SyntaxError("Can't parse the input: expected an object key");
    }

    return _const.PARSING_COMPLETE;
  }

  this.value = this.matched[0];

  if (this.value === '"') {
    yield {
      name: 'startKey'
    };
    this.expected = _const.parserStateTypes.KEY_VAL;
  } else if (this.value === '}') {
    if (this.expected !== _const.parserStateTypes.KEY1) {
      throw new SyntaxError("Can't parse the input: unexpected token '}'");
    }

    yield {
      name: 'endObject'
    };
    this.parent = this.stack.pop();
    this.expected = _const.parserExpected[this.parent];
  }

  this.index += this.value.length;
}

_const.parserStates[_const.parserStateTypes.KEY] = key;
_const.parserStates[_const.parserStateTypes.KEY1] = key;