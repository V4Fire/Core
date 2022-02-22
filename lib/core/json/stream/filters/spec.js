"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _parser = _interopRequireDefault(require("../../../../core/json/stream/parser"));

var _filters = require("../../../../core/json/stream/filters");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/json/stream/filters', () => {
  describe('`Filter`', () => {
    it('filtering tokens by the specified path', async () => {
      const input = `{
				"a": {
					"b": [1, 2, 3]
				},

				"c": 2
			}`;
      const tokens = [];

      for await (const token of _parser.default.from([input], new _filters.Filter('a.b'))) {
        tokens.push(token);
      }

      const expected = [...new _parser.default().processChunk(`{
					"a": {
						"b": [1, 2, 3]
					}
				}`)];
      expect(tokens).toEqual(expected);
    });
    it('filtering tokens by the specified RegExp', async () => {
      const input = '[{"a": 1}, [1], true, null]',
            tokens = [];

      for await (const token of _parser.default.from([input], new _filters.Filter(/^[02]\.?/))) {
        tokens.push(token);
      }

      expect(tokens).toEqual([...new _parser.default().processChunk('[{"a": 1}, true]')]);
    });
    it('filtering tokens by the specified function', async () => {
      const input = '[{"a": 1}, [1], true, {"a": 2}]',
            tokens = [];

      for await (const token of _parser.default.from([input], new _filters.Filter(stack => stack.includes('a')))) {
        tokens.push(token);
      }

      expect(tokens).toEqual([...new _parser.default().processChunk('[{"a": 1}, {"a": 2}]')]);
    });
  });
  describe('`Pick`', () => {
    it('picking a token by the specified path', async () => {
      const input = `{
				"a": {
					"b": [1, 2, 3]
				},

				"c": 2
			}`;
      const tokens = [];

      for await (const token of _parser.default.from([input], new _filters.Pick('a.b'))) {
        tokens.push(token);
      }

      expect(tokens).toEqual([...new _parser.default().processChunk('[1, 2, 3]')]);
    });
    it('picking the first token matched with the specified RegExp', async () => {
      const input = '[{"a": 1}, [1], true, null]',
            tokens = [];

      for await (const token of _parser.default.from([input], new _filters.Pick(/^[02]\.?/))) {
        tokens.push(token);
      }

      expect(tokens).toEqual([...new _parser.default().processChunk('{"a": 1}')]);
    });
    it('picking all tokens matched with the specified RegExp', async () => {
      const input = '[{"a": 1}, [1], true, null]',
            tokens = [];

      for await (const token of _parser.default.from([input], new _filters.Pick(/^[02]\.?/, {
        multiple: true
      }))) {
        tokens.push(token);
      }

      expect(tokens).toEqual([...new _parser.default().processChunk('{"a": 1}'), ...new _parser.default().processChunk('true')]);
    });
    it('picking the first token filtered by the specified function', async () => {
      const input = '[{"a": 1}, [1], true, {"a": 2}]',
            tokens = [];

      for await (const token of _parser.default.from([input], new _filters.Pick(stack => stack.includes('a')))) {
        tokens.push(token);
      }

      const parser = new _parser.default();
      expect(tokens).toEqual([...parser.processChunk('1'), ...parser.finishChunkProcessing()]);
    });
    it('picking all tokens filtered by the specified function', async () => {
      const input = '[{"a": 1}, [1], true, {"a": 2}]',
            tokens = [];

      for await (const token of _parser.default.from([input], new _filters.Pick(stack => stack.includes('a'), {
        multiple: true
      }))) {
        tokens.push(token);
      }

      const parser1 = new _parser.default(),
            parser2 = new _parser.default();
      expect(tokens).toEqual([...parser1.processChunk('1'), ...parser1.finishChunkProcessing(), ...parser2.processChunk('2'), ...parser2.finishChunkProcessing()]);
    });
  });
});