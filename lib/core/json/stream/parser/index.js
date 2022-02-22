"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;

var _states = require("../../../../core/json/stream/parser/states");

var _const = require("../../../../core/json/stream/parser/const");

Object.keys(_const).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _const[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _const[key];
    }
  });
});

var _interface = require("../../../../core/json/stream/parser/interface");

Object.keys(_interface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface[key];
    }
  });
});

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/json/stream/parser/README.md]]
 * @packageDocumentation
 */
class Parser {
  /**
   * Parses the specified iterable object as a JSON stream and yields tokens or values via a Generator
   *
   * @param source
   * @param [processors] - list of token processors to apply to the output iterable
   */
  static async *from(source, ...processors) {
    const parser = new Parser();

    for await (const chunk of source) {
      yield* process(parser.processChunk(chunk));
    }

    yield* process(parser.finishChunkProcessing());

    function* process(stream, currentProcessor = 0) {
      if (currentProcessor >= processors.length) {
        yield* stream;
        return;
      }

      const processor = processors[currentProcessor];

      for (const val of stream) {
        yield* process(processor.processToken(val), currentProcessor + 1);
      }

      if (processor.finishTokenProcessing != null) {
        yield* process(processor.finishTokenProcessing(), currentProcessor + 1);
      }
    }
  }
  /**
   * The current parent of a parsed structure
   */


  parent = _const.parserStateTypes.EMPTY;
  /**
   * An array of parent objects for the current parsed structure
   */

  stack = [];
  /**
   * The current piece of JSON
   */

  buffer = '';
  /**
   * Accumulator for the current parsed structure
   */

  accumulator = '';
  /**
   * The current parsed value
   */

  value = '';
  /**
   * The current index in a buffer parsing process
   */

  index = 0;
  /**
   * The current match value after RegExp execution
   */

  /**
   * The next expected parser state from a stream
   */
  expected = _const.parserStateTypes.VALUE;
  /**
   * Dictionary with RegExp-s to different types of data
   */

  patterns = _const.parserPatterns;
  /**
   * Is the parser parsing a number now
   */

  isOpenNumber = false;
  /**
   * Closes all unclosed tokens and returns a Generator of tokens.
   * The method must be called after the end of parsing.
   */

  *finishChunkProcessing() {
    if (this.expected !== _const.parserStateTypes.DONE) {
      this.expected = _const.parserStateTypes.DONE;
      yield* _states.parserStates[this.expected].call(this);
    }
  }
  /**
   * Processes the passed JSON chunk and yields tokens via an asynchronous Generator
   * @param chunk
   */


  *processChunk(chunk) {
    this.buffer += chunk;
    this.matched = null;
    this.value = '';
    this.index = 0;

    while (true) {
      const handler = _states.parserStates[this.expected],
            iter = handler.call(this);
      let res;

      while (true) {
        const val = iter.next();

        if (val.done) {
          res = val.value;
          break;
        } else {
          yield val.value;
        }
      }

      if (res === _const.PARSING_COMPLETE) {
        break;
      }
    }

    this.buffer = this.buffer.slice(this.index);
  }

}

exports.default = Parser;