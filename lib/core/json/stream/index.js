"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  from: true,
  filter: true,
  pick: true,
  andPick: true,
  assemble: true,
  streamArray: true,
  streamObject: true
};
exports.andPick = andPick;
exports.assemble = assemble;
exports.filter = filter;
exports.from = from;
exports.pick = pick;
exports.streamArray = streamArray;
exports.streamObject = streamObject;
var _combinators = require("../../../core/iter/combinators");
var _parser = _interopRequireDefault(require("../../../core/json/stream/parser"));
var _assembler = _interopRequireDefault(require("../../../core/json/stream/assembler"));
var _filters = require("../../../core/json/stream/filters");
var _streamers = require("../../../core/json/stream/streamers");
var _interface = require("../../../core/json/stream/interface");
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
function from(source) {
  return _parser.default.from(source);
}
async function* filter(source, filter) {
  const f = new _filters.Filter(filter);
  for await (const chunk of source) {
    yield* f.processToken(chunk);
  }
  yield* f.finishTokenProcessing();
}
async function* pick(source, selector, opts) {
  const p = new _filters.Pick(selector, opts);
  for await (const token of source) {
    const tokens = [...p.processToken(token)],
      lastToken = tokens[tokens.length - 1];
    if (lastToken?.filterComplete) {
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token === lastToken) {
          yield Object.reject(lastToken, 'filterComplete');
          return;
        }
        yield token;
      }
    } else {
      yield* Object.cast(tokens);
    }
  }
}
function andPick(source, selector, opts) {
  let stage = 0;
  const startObject = {
    [Symbol.asyncIterator]() {
      return this;
    },
    next() {
      if (stage++ === 0) {
        return Promise.resolve({
          value: {
            name: `start-${opts?.from ?? 'object'}`.camelize(false)
          },
          done: false
        });
      }
      return Promise.resolve({
        value: undefined,
        done: true
      });
    }
  };
  return pick((0, _combinators.seq)(startObject, source), selector, opts);
}
async function* assemble(source, opts) {
  const a = new _assembler.default(opts);
  for await (const chunk of source) {
    yield* a.processToken(chunk);
  }
}
async function* streamArray(source, opts) {
  const s = new _streamers.ArrayStreamer(opts);
  for await (const chunk of source) {
    yield* s.processToken(chunk);
  }
}
async function* streamObject(source, opts) {
  const s = new _streamers.ObjectStreamer(opts);
  for await (const chunk of source) {
    yield* s.processToken(chunk);
  }
}