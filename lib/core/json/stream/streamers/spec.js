"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _parser = _interopRequireDefault(require("../../../../core/json/stream/parser"));

var _filters = require("../../../../core/json/stream/filters");

var _streamers = require("../../../../core/json/stream/streamers");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/json/stream/streamers', () => {
  describe('`ArrayStreamer`', () => {
    it('should stream an array', async () => {
      const data = `{
				"a": {
					"b": [{"a": 1}, 1.34E-1, [2], true]
				},

				"c": 2
			}`;
      const tokens = [];

      for await (const token of _parser.default.from([data], new _filters.Pick('a.b'), new _streamers.ArrayStreamer())) {
        tokens.push(token);
      }

      expect(tokens).toEqual([{
        index: 0,
        value: {
          a: 1
        }
      }, {
        index: 1,
        value: 0.134
      }, {
        index: 2,
        value: [2]
      }, {
        index: 3,
        value: true
      }]);
    });
    it('should stream nothing if the source array is empty', async () => {
      const tokens = [];

      for await (const token of _parser.default.from(['[]'], new _streamers.ArrayStreamer())) {
        tokens.push(token);
      }

      expect(tokens).toEqual([]);
    });
    it('should throw an error if the streamed data is not an array', async () => {
      let err;
      const tokens = [];

      try {
        for await (const token of _parser.default.from(['{"a": 1}'], new _streamers.ArrayStreamer())) {
          tokens.push(token);
        }
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(TypeError);
      expect(err.message).toBe('The top-level object should be an array');
    });
  });
  describe('`ObjectStreamer`', () => {
    it('should stream an object', async () => {
      const data = `{
				"a": {
					"b": 2
				},

				"c": 2
			}`;
      const tokens = [];

      for await (const token of _parser.default.from([data], new _streamers.ObjectStreamer())) {
        tokens.push(token);
      }

      expect(tokens).toEqual([{
        key: 'a',
        value: {
          b: 2
        }
      }, {
        key: 'c',
        value: 2
      }]);
    });
    it('should stream nothing if the source object is empty', async () => {
      const tokens = [];

      for await (const token of _parser.default.from(['{}'], new _streamers.ObjectStreamer())) {
        tokens.push(token);
      }

      expect(tokens).toEqual([]);
    });
    it('should throw an error if the streamed data is not an object', async () => {
      let err;
      const tokens = [];

      try {
        for await (const token of _parser.default.from(['[1,2]'], new _streamers.ObjectStreamer())) {
          tokens.push(token);
        }
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(TypeError);
      expect(err.message).toBe('The top-level object should be an object');
    });
  });
});