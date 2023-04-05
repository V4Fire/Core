"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _parser = _interopRequireDefault(require("../../../../core/json/stream/parser"));
describe('core/json/stream/parser', () => {
  describe('parsing of primitive values', () => {
    it('integer numbers', async () => {
      {
        const tokens = [];
        for await (const token of _parser.default.from('100500')) {
          tokens.push(token);
        }
        expect(tokens).toEqual([{
          name: 'startNumber'
        }, {
          name: 'numberChunk',
          value: '1'
        }, {
          name: 'numberChunk',
          value: '0'
        }, {
          name: 'numberChunk',
          value: '0'
        }, {
          name: 'numberChunk',
          value: '5'
        }, {
          name: 'numberChunk',
          value: '0'
        }, {
          name: 'numberChunk',
          value: '0'
        }, {
          name: 'endNumber'
        }, {
          name: 'numberValue',
          value: '100500'
        }]);
      }
      {
        const tokens = [];
        for await (const token of _parser.default.from('-12')) {
          tokens.push(token);
        }
        expect(tokens).toEqual([{
          name: 'startNumber'
        }, {
          name: 'numberChunk',
          value: '-'
        }, {
          name: 'numberChunk',
          value: '1'
        }, {
          name: 'numberChunk',
          value: '2'
        }, {
          name: 'endNumber'
        }, {
          name: 'numberValue',
          value: '-12'
        }]);
      }
    });
    it('numbers with a floating points', async () => {
      {
        const tokens = [];
        for await (const token of _parser.default.from('12.3')) {
          tokens.push(token);
        }
        expect(tokens).toEqual([{
          name: 'startNumber'
        }, {
          name: 'numberChunk',
          value: '1'
        }, {
          name: 'numberChunk',
          value: '2'
        }, {
          name: 'numberChunk',
          value: '.'
        }, {
          name: 'numberChunk',
          value: '3'
        }, {
          name: 'endNumber'
        }, {
          name: 'numberValue',
          value: '12.3'
        }]);
      }
      {
        const tokens = [];
        for await (const token of _parser.default.from('-12.300')) {
          tokens.push(token);
        }
        expect(tokens).toEqual([{
          name: 'startNumber'
        }, {
          name: 'numberChunk',
          value: '-'
        }, {
          name: 'numberChunk',
          value: '1'
        }, {
          name: 'numberChunk',
          value: '2'
        }, {
          name: 'numberChunk',
          value: '.'
        }, {
          name: 'numberChunk',
          value: '3'
        }, {
          name: 'numberChunk',
          value: '0'
        }, {
          name: 'numberChunk',
          value: '0'
        }, {
          name: 'endNumber'
        }, {
          name: 'numberValue',
          value: '-12.300'
        }]);
      }
    });
    it('numbers in an exponential form', async () => {
      {
        const tokens = [];
        for await (const token of _parser.default.from('12e10')) {
          tokens.push(token);
        }
        expect(tokens).toEqual([{
          name: 'startNumber'
        }, {
          name: 'numberChunk',
          value: '1'
        }, {
          name: 'numberChunk',
          value: '2'
        }, {
          name: 'numberChunk',
          value: 'e'
        }, {
          name: 'numberChunk',
          value: '1'
        }, {
          name: 'numberChunk',
          value: '0'
        }, {
          name: 'endNumber'
        }, {
          name: 'numberValue',
          value: '12e10'
        }]);
      }
      {
        const tokens = [];
        for await (const token of _parser.default.from('-1E2')) {
          tokens.push(token);
        }
        expect(tokens).toEqual([{
          name: 'startNumber'
        }, {
          name: 'numberChunk',
          value: '-'
        }, {
          name: 'numberChunk',
          value: '1'
        }, {
          name: 'numberChunk',
          value: 'E'
        }, {
          name: 'numberChunk',
          value: '2'
        }, {
          name: 'endNumber'
        }, {
          name: 'numberValue',
          value: '-1E2'
        }]);
      }
      {
        const tokens = [];
        for await (const token of _parser.default.from('-1.4e2')) {
          tokens.push(token);
        }
        expect(tokens).toEqual([{
          name: 'startNumber'
        }, {
          name: 'numberChunk',
          value: '-'
        }, {
          name: 'numberChunk',
          value: '1'
        }, {
          name: 'numberChunk',
          value: '.'
        }, {
          name: 'numberChunk',
          value: '4'
        }, {
          name: 'numberChunk',
          value: 'e'
        }, {
          name: 'numberChunk',
          value: '2'
        }, {
          name: 'endNumber'
        }, {
          name: 'numberValue',
          value: '-1.4e2'
        }]);
      }
      {
        const tokens = [];
        for await (const token of _parser.default.from('4.4e-2')) {
          tokens.push(token);
        }
        expect(tokens).toEqual([{
          name: 'startNumber'
        }, {
          name: 'numberChunk',
          value: '4'
        }, {
          name: 'numberChunk',
          value: '.'
        }, {
          name: 'numberChunk',
          value: '4'
        }, {
          name: 'numberChunk',
          value: 'e'
        }, {
          name: 'numberChunk',
          value: '-'
        }, {
          name: 'numberChunk',
          value: '2'
        }, {
          name: 'endNumber'
        }, {
          name: 'numberValue',
          value: '4.4e-2'
        }]);
      }
      {
        const tokens = [];
        for await (const token of _parser.default.from('-4.4e-2')) {
          tokens.push(token);
        }
        expect(tokens).toEqual([{
          name: 'startNumber'
        }, {
          name: 'numberChunk',
          value: '-'
        }, {
          name: 'numberChunk',
          value: '4'
        }, {
          name: 'numberChunk',
          value: '.'
        }, {
          name: 'numberChunk',
          value: '4'
        }, {
          name: 'numberChunk',
          value: 'e'
        }, {
          name: 'numberChunk',
          value: '-'
        }, {
          name: 'numberChunk',
          value: '2'
        }, {
          name: 'endNumber'
        }, {
          name: 'numberValue',
          value: '-4.4e-2'
        }]);
      }
    });
    it('strings', async () => {
      {
        const tokens = [];
        for await (const token of _parser.default.from('"foo bar"')) {
          tokens.push(token);
        }
        expect(tokens).toEqual([{
          name: 'startString'
        }, {
          name: 'stringChunk',
          value: 'f'
        }, {
          name: 'stringChunk',
          value: 'o'
        }, {
          name: 'stringChunk',
          value: 'o'
        }, {
          name: 'stringChunk',
          value: ' '
        }, {
          name: 'stringChunk',
          value: 'b'
        }, {
          name: 'stringChunk',
          value: 'a'
        }, {
          name: 'stringChunk',
          value: 'r'
        }, {
          name: 'endString'
        }, {
          name: 'stringValue',
          value: 'foo bar'
        }]);
      }
      {
        const tokens = [];
        for await (const token of _parser.default.from(['"foo\t\tbar"'])) {
          tokens.push(token);
        }
        expect(tokens).toEqual([{
          name: 'startString'
        }, {
          name: 'stringChunk',
          value: 'foo\t\tbar'
        }, {
          name: 'endString'
        }, {
          name: 'stringValue',
          value: 'foo\t\tbar'
        }]);
      }
    });
    it('booleans', () => {
      {
        const parser = new _parser.default();
        expect([...parser.processChunk('true'), ...parser.finishChunkProcessing()]).toEqual([{
          name: 'trueValue',
          value: true
        }]);
      }
      {
        const parser = new _parser.default();
        expect([...parser.processChunk('false'), ...parser.finishChunkProcessing()]).toEqual([{
          name: 'falseValue',
          value: false
        }]);
      }
    });
    it('null', () => {
      const parser = new _parser.default();
      expect([...parser.processChunk('null'), ...parser.finishChunkProcessing()]).toEqual([{
        name: 'nullValue',
        value: null
      }]);
    });
  });
  it('should parse JSON chunks to tokens with the specified bytes step', async () => {
    const input = {
      a: 0.14E10,
      b: true,
      c: ['foo'],
      d: {
        e: null,
        f: [135, 2e-10, -32.42152]
      }
    };
    const tokens = [];
    for await (const token of _parser.default.from(createChunkIterator(input, 3))) {
      tokens.push(token);
    }
    expect(tokens).toEqual([{
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
      name: 'numberChunk',
      value: '400'
    }, {
      name: 'numberChunk',
      value: '000'
    }, {
      name: 'numberChunk',
      value: '000'
    }, {
      name: 'endNumber'
    }, {
      name: 'numberValue',
      value: '1400000000'
    }, {
      name: 'startKey'
    }, {
      name: 'stringChunk',
      value: 'b'
    }, {
      name: 'endKey'
    }, {
      name: 'keyValue',
      value: 'b'
    }, {
      name: 'trueValue',
      value: true
    }, {
      name: 'startKey'
    }, {
      name: 'stringChunk',
      value: 'c'
    }, {
      name: 'endKey'
    }, {
      name: 'keyValue',
      value: 'c'
    }, {
      name: 'startArray'
    }, {
      name: 'startString'
    }, {
      name: 'stringChunk',
      value: 'fo'
    }, {
      name: 'stringChunk',
      value: 'o'
    }, {
      name: 'endString'
    }, {
      name: 'stringValue',
      value: 'foo'
    }, {
      name: 'endArray'
    }, {
      name: 'startKey'
    }, {
      name: 'stringChunk',
      value: 'd'
    }, {
      name: 'endKey'
    }, {
      name: 'keyValue',
      value: 'd'
    }, {
      name: 'startObject'
    }, {
      name: 'startKey'
    }, {
      name: 'stringChunk',
      value: 'e'
    }, {
      name: 'endKey'
    }, {
      name: 'keyValue',
      value: 'e'
    }, {
      name: 'nullValue',
      value: null
    }, {
      name: 'startKey'
    }, {
      name: 'stringChunk',
      value: 'f'
    }, {
      name: 'endKey'
    }, {
      name: 'keyValue',
      value: 'f'
    }, {
      name: 'startArray'
    }, {
      name: 'startNumber'
    }, {
      name: 'numberChunk',
      value: '1'
    }, {
      name: 'numberChunk',
      value: '35'
    }, {
      name: 'endNumber'
    }, {
      name: 'numberValue',
      value: '135'
    }, {
      name: 'startNumber'
    }, {
      name: 'numberChunk',
      value: '2'
    }, {
      name: 'numberChunk',
      value: 'e'
    }, {
      name: 'numberChunk',
      value: '-'
    }, {
      name: 'numberChunk',
      value: '1'
    }, {
      name: 'numberChunk',
      value: '0'
    }, {
      name: 'endNumber'
    }, {
      name: 'numberValue',
      value: '2e-10'
    }, {
      name: 'startNumber'
    }, {
      name: 'numberChunk',
      value: '-'
    }, {
      name: 'numberChunk',
      value: '3'
    }, {
      name: 'numberChunk',
      value: '2'
    }, {
      name: 'numberChunk',
      value: '.'
    }, {
      name: 'numberChunk',
      value: '4'
    }, {
      name: 'numberChunk',
      value: '2'
    }, {
      name: 'numberChunk',
      value: '152'
    }, {
      name: 'endNumber'
    }, {
      name: 'numberValue',
      value: '-32.42152'
    }, {
      name: 'endArray'
    }, {
      name: 'endObject'
    }, {
      name: 'endObject'
    }]);
  });
  it('should successfully parse JSON chunks with escaped fields', () => {
    const parser = new _parser.default();
    const input = {
      stringWithTabsAndNewlines: "Did it work?\nNo...\t\tI don't think so...",
      array: [1, 2, true, 'tabs?\t\t\t\u0001\u0002\u0003', false]
    };
    const iter = createChunkIterator(input, 10),
      tokens = [];
    for (const chunk of iter) {
      for (const token of parser.processChunk(chunk)) {
        tokens.push(token);
      }
    }
    expect(tokens).toEqual([{
      name: 'startObject'
    }, {
      name: 'startKey'
    }, {
      name: 'stringChunk',
      value: 'stringWi'
    }, {
      name: 'stringChunk',
      value: 'thTabsAndN'
    }, {
      name: 'stringChunk',
      value: 'ewlines'
    }, {
      name: 'endKey'
    }, {
      name: 'keyValue',
      value: 'stringWithTabsAndNewlines'
    }, {
      name: 'startString'
    }, {
      name: 'stringChunk',
      value: 'Did it wor'
    }, {
      name: 'stringChunk',
      value: 'k?'
    }, {
      name: 'stringChunk',
      value: '\n'
    }, {
      name: 'stringChunk',
      value: 'No...'
    }, {
      name: 'stringChunk',
      value: '\t'
    }, {
      name: 'stringChunk',
      value: '\t'
    }, {
      name: 'stringChunk',
      value: "I don't"
    }, {
      name: 'stringChunk',
      value: ' think so.'
    }, {
      name: 'stringChunk',
      value: '..'
    }, {
      name: 'endString'
    }, {
      name: 'stringValue',
      value: "Did it work?\nNo...\t\tI don't think so..."
    }, {
      name: 'startKey'
    }, {
      name: 'stringChunk',
      value: 'array'
    }, {
      name: 'endKey'
    }, {
      name: 'keyValue',
      value: 'array'
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
      name: 'trueValue',
      value: true
    }, {
      name: 'startString'
    }, {
      name: 'stringChunk',
      value: 'tabs?'
    }, {
      name: 'stringChunk',
      value: '\t'
    }, {
      name: 'stringChunk',
      value: '\t'
    }, {
      name: 'stringChunk',
      value: '\t'
    }, {
      name: 'stringChunk',
      value: '\x01'
    }, {
      name: 'stringChunk',
      value: '\x02'
    }, {
      name: 'stringChunk',
      value: '\x03'
    }, {
      name: 'endString'
    }, {
      name: 'stringValue',
      value: 'tabs?\t\t\t\x01\x02\x03'
    }, {
      name: 'falseValue',
      value: false
    }, {
      name: 'endArray'
    }, {
      name: 'endObject'
    }]);
  });
  it('should throw an error if a JSON chunk is invalid', () => {
    const parser = new _parser.default(),
      tokens = [];
    const input = '{"key1":1}garbage{"key3":2}',
      iter = createChunkIterator(input);
    expect(iterate).toThrow(new SyntaxError('Can\'t parse the input: unexpected characters'));
    function iterate() {
      for (const chunk of iter) {
        for (const el of parser.processChunk(chunk)) {
          tokens.push(el);
        }
      }
    }
  });
  it("should throw an error if double quotes don't wrap a JSON object key", () => {
    const parser = new _parser.default(),
      tokens = [];
    const input = '{key: 1}',
      iter = createChunkIterator(input);
    expect(iterate).toThrow(new SyntaxError("Can't parse the input: expected an object key"));
    function iterate() {
      for (const chunk of iter) {
        for (const el of parser.processChunk(chunk)) {
          tokens.push(el);
        }
      }
    }
  });
  it('should throw an error if single quotes wrap a JSON object key', () => {
    const parser = new _parser.default(),
      tokens = [];
    const input = "{'key': 1}",
      iter = createChunkIterator(input);
    expect(iterate).toThrow(new SyntaxError("Can't parse the input: expected an object key"));
    function iterate() {
      for (const chunk of iter) {
        for (const el of parser.processChunk(chunk)) {
          tokens.push(el);
        }
      }
    }
  });
});
function createChunkIterator(input, step = 1) {
  const data = typeof input === 'string' ? input : JSON.stringify(input);
  let index = 0;
  return {
    [Symbol.iterator]() {
      return {
        next() {
          const start = index;
          index += step;
          return {
            value: data.substring(start, index),
            done: start > data.length
          };
        }
      };
    }
  };
}