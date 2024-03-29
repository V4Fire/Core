"use strict";

var _iter = require("../../../core/iter");
var _combinators = require("../../../core/iter/combinators");
var _stream = require("../../../core/json/stream");
describe('core/json/stream', () => {
  describe('`from`', () => {
    it('should parse sync JSON stream to tokens', async () => {
      const tokens = [];
      for await (const token of (0, _stream.from)(['[1, {"a": 1}, true]'])) {
        tokens.push(token);
      }
      expect(tokens).toEqual([{
        name: 'startArray'
      }, {
        name: 'startNumber'
      }, {
        name: 'numberChunk',
        value: '1'
      }, {
        name: 'endNumber'
      }, {
        name: 'numberValue',
        value: '1'
      }, {
        name: 'startObject'
      }, {
        name: 'startKey'
      }, {
        name: 'stringChunk',
        value: 'a'
      }, {
        name: 'endKey'
      }, {
        name: 'keyValue',
        value: 'a'
      }, {
        name: 'startNumber'
      }, {
        name: 'numberChunk',
        value: '1'
      }, {
        name: 'endNumber'
      }, {
        name: 'numberValue',
        value: '1'
      }, {
        name: 'endObject'
      }, {
        name: 'trueValue',
        value: true
      }, {
        name: 'endArray'
      }]);
    });
    it('should parse async JSON stream to tokens', async () => {
      const tokens = [];
      for await (const token of (0, _stream.from)(intoAsyncIter(['[1, {"a', '": 1},', 'true]']))) {
        tokens.push(token);
      }
      expect(tokens).toEqual([{
        name: 'startArray'
      }, {
        name: 'startNumber'
      }, {
        name: 'numberChunk',
        value: '1'
      }, {
        name: 'endNumber'
      }, {
        name: 'numberValue',
        value: '1'
      }, {
        name: 'startObject'
      }, {
        name: 'startKey'
      }, {
        name: 'stringChunk',
        value: 'a'
      }, {
        name: 'endKey'
      }, {
        name: 'keyValue',
        value: 'a'
      }, {
        name: 'startNumber'
      }, {
        name: 'numberChunk',
        value: '1'
      }, {
        name: 'endNumber'
      }, {
        name: 'numberValue',
        value: '1'
      }, {
        name: 'endObject'
      }, {
        name: 'trueValue',
        value: true
      }, {
        name: 'endArray'
      }]);
    });
  });
  describe('filters', () => {
    it('should filter JSON tokens and preserves only that matched to a filter', async () => {
      const tokens = [];
      for await (const token of (0, _stream.filter)((0, _stream.from)(['{"a": 1, "b": 2, "data": [1, 2, 3]}']), /data/)) {
        tokens.push(token);
      }
      expect(tokens).toEqual([{
        name: 'startObject'
      }, {
        name: 'startKey'
      }, {
        name: 'stringChunk',
        value: 'data'
      }, {
        name: 'endKey'
      }, {
        name: 'keyValue',
        value: 'data'
      }, {
        name: 'startArray'
      }, {
        name: 'startNumber'
      }, {
        name: 'numberChunk',
        value: '1'
      }, {
        name: 'endNumber'
      }, {
        name: 'numberValue',
        value: '1'
      }, {
        name: 'startNumber'
      }, {
        name: 'numberChunk',
        value: '2'
      }, {
        name: 'endNumber'
      }, {
        name: 'numberValue',
        value: '2'
      }, {
        name: 'startNumber'
      }, {
        name: 'numberChunk',
        value: '3'
      }, {
        name: 'endNumber'
      }, {
        name: 'numberValue',
        value: '3'
      }, {
        name: 'endArray'
      }, {
        name: 'endObject'
      }]);
    });
    it('should pick tokens from a stream by the specified selector', async () => {
      const tokens = [];
      for await (const token of (0, _stream.pick)((0, _stream.from)('{"a": 1, "b": 2, "data": [1, 2, 3]}'), /data/)) {
        tokens.push(token);
      }
      expect(tokens).toEqual([{
        name: 'startArray'
      }, {
        name: 'startNumber'
      }, {
        name: 'numberChunk',
        value: '1'
      }, {
        name: 'endNumber'
      }, {
        name: 'numberValue',
        value: '1'
      }, {
        name: 'startNumber'
      }, {
        name: 'numberChunk',
        value: '2'
      }, {
        name: 'endNumber'
      }, {
        name: 'numberValue',
        value: '2'
      }, {
        name: 'startNumber'
      }, {
        name: 'numberChunk',
        value: '3'
      }, {
        name: 'endNumber'
      }, {
        name: 'numberValue',
        value: '3'
      }, {
        name: 'endArray'
      }]);
    });
    it('should combine several picks', async () => {
      const tokens = (0, _iter.intoIter)((0, _stream.from)(JSON.stringify({
        total: 3,
        data: [{
          user: 'Bob',
          age: 21
        }, {
          user: 'Ben',
          age: 24
        }, {
          user: 'Rob',
          age: 28
        }]
      })));
      const seq = (0, _combinators.sequence)((0, _stream.assemble)((0, _stream.pick)(tokens, 'total')), (0, _stream.assemble)((0, _stream.andPick)(tokens, 'data.0')), (0, _stream.assemble)((0, _stream.andPick)(tokens, '1', {
        from: 'array'
      })));
      const res = [];
      for await (const val of seq) {
        res.push(val);
      }
      expect(res).toEqual([3, {
        user: 'Bob',
        age: 21
      }, {
        user: 'Rob',
        age: 28
      }]);
    });
  });
  describe('`assemble`', () => {
    it('should assemble a valid js structure from the given json tokens', async () => {
      const data = [{
        a: 1
      }, [2, 3, 4], true];
      let res;
      for await (const val of (0, _stream.assemble)((0, _stream.from)(intoAsyncIter(JSON.stringify(data))))) {
        res = val;
      }
      expect(res).toEqual(data);
    });
  });
  describe('streamers', () => {
    it('should stream array elements from JSON tokens', async () => {
      const elements = [];
      for await (const el of (0, _stream.streamArray)((0, _stream.from)('[{"a": 1}, true, 0.1e12]'))) {
        elements.push(el);
      }
      expect(elements).toEqual([{
        index: 0,
        value: {
          a: 1
        }
      }, {
        index: 1,
        value: true
      }, {
        index: 2,
        value: 100000000000
      }]);
    });
    it('should stream object elements from JSON tokens', async () => {
      const elements = [];
      for await (const el of (0, _stream.streamObject)((0, _stream.from)('{"a": 1, "b": [1, 2], "c": true, "d": {"a": 1}'))) {
        elements.push(el);
      }
      expect(elements).toEqual([{
        key: 'a',
        value: 1
      }, {
        key: 'b',
        value: [1, 2]
      }, {
        key: 'c',
        value: true
      }, {
        key: 'd',
        value: {
          a: 1
        }
      }]);
    });
  });
});
async function* intoAsyncIter(source) {
  for (const val of source) {
    await new Promise(resolve => setTimeout(resolve, 10));
    yield val;
  }
}