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
class Parser {
  static async *from(source, ...processors) {
    const parser = new Parser();
    for await (const chunk of source) {
      yield* process(parser.processChunk(chunk));
    }
    yield* process(parser.finishChunkProcessing());
    function* process(stream, currentProcessor = 0) {
      if (currentProcessor >= processors.length) {
        for (const el of stream) {
          yield el;
        }
        return;
      }
      const processor = processors[currentProcessor];
      for (const val of stream) {
        yield* process(processor.processToken(Object.cast(val)), currentProcessor + 1);
      }
      if (processor.finishTokenProcessing != null) {
        yield* process(processor.finishTokenProcessing(), currentProcessor + 1);
      }
    }
  }
  parent = _const.parserStateTypes.EMPTY;
  stack = [];
  buffer = '';
  accumulator = '';
  value = '';
  index = 0;
  expected = _const.parserStateTypes.VALUE;
  patterns = _const.parserPatterns;
  isOpenNumber = false;
  *finishChunkProcessing() {
    if (this.expected !== _const.parserStateTypes.DONE) {
      this.expected = _const.parserStateTypes.DONE;
      yield* _states.parserStates[this.expected].call(this);
    }
  }
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