"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assemble = assemble;
exports.filter = filter;
exports.from = from;
exports.pick = pick;
exports.streamArray = streamArray;
exports.streamObject = streamObject;

var _parser = _interopRequireDefault(require("../../../core/json/stream/parser"));

var _assembler = _interopRequireDefault(require("../../../core/json/stream/assembler"));

var _filters = require("../../../core/json/stream/filters");

var _streamers = require("../../../core/json/stream/streamers");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/json/stream/README.md]]
 * @packageDocumentation
 */

/**
 * Parses the specified iterable object as a JSON stream and yields tokens via a Generator
 * @param source
 */
function from(source) {
  return _parser.default.from(source);
}
/**
 * Takes the specified iterable object of tokens and filters it via the specified filter
 *
 * @param source
 * @param filter
 */


async function* filter(source, filter) {
  const f = new _filters.Filter(filter);

  for await (const chunk of source) {
    yield* f.processToken(chunk);
  }

  yield* f.finishTokenProcessing();
}
/**
 * Takes the specified iterable object of tokens and pick from it value that matches the specified selector
 *
 * @param source
 * @param selector
 * @param [opts] - additional filter options
 */


async function* pick(source, selector, opts) {
  const p = new _filters.Pick(selector, opts);

  for await (const chunk of source) {
    yield* p.processToken(chunk);
  }
}
/**
 * Takes the specified iterable object of tokens and yields an assembled item from it
 *
 * @param source
 * @param [opts] - additional options
 */


async function* assemble(source, opts) {
  const a = new _assembler.default(opts);

  for await (const chunk of source) {
    yield* a.processToken(chunk);
  }
}
/**
 * Takes the specified iterable object of tokens representing an array and yields assembled array items
 *
 * @param source
 * @param [opts] - additional options
 */


async function* streamArray(source, opts) {
  const s = new _streamers.ArrayStreamer(opts);

  for await (const chunk of source) {
    yield* s.processToken(chunk);
  }
}
/**
 * Takes the specified iterable object of tokens representing an object and yields assembled object items
 *
 * @param source
 * @param [opts] - additional options
 */


async function* streamObject(source, opts) {
  const s = new _streamers.ObjectStreamer(opts);

  for await (const chunk of source) {
    yield* s.processToken(chunk);
  }
}