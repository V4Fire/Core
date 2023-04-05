"use strict";

var _iter = require("../../../core/iter");
var _combinators = require("../../../core/iter/combinators");
var _stream = require("../../../core/json/stream");
describe('core/iter/combinators', () => {
  describe('sequence', () => {
    it('sequence of sync iterators', () => {
      const seq = (0, _combinators.sequence)([1, 2], new Set([3, 4]), [5, 6].values());
      expect([...seq]).toEqual([1, 2, 3, 4, 5, 6]);
    });
    it('sequence of async iterators', async () => {
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
      const seq = (0, _combinators.sequence)((0, _stream.assemble)((0, _stream.pick)(tokens, 'total')), (0, _stream.streamArray)((0, _stream.andPick)(tokens, 'data')));
      const res = [];
      for await (const val of seq) {
        res.push(val);
      }
      expect(res).toEqual([3, {
        index: 0,
        value: {
          user: 'Bob',
          age: 21
        }
      }, {
        index: 1,
        value: {
          user: 'Ben',
          age: 24
        }
      }, {
        index: 2,
        value: {
          user: 'Rob',
          age: 28
        }
      }]);
    });
  });
});