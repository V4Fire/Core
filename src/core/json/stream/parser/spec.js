/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { Parser } from 'core/json/stream/parser';

describe('core/json/stream/parser', () => {
	it('should parse JSON chunks to tokens with the specified bytes step', () => {
		const input = {
			a: 1,
			b: true,
			c: ['foo'],
			d: {
				e: null,
				f: [1, 2, 3]
			}
		};

		const
			parser = new Parser(),
			res = [];

		for (const chunk of createChunkIterator(input, 3)) {
			for (const el of parser.processChunk(chunk)) {
				res.push(el);
			}
		}

		expect(res).toEqual([
			{name: 'startObject'},
			{name: 'startKey'},
			{name: 'stringChunk', value: 'a'},
			{name: 'endKey'},
			{name: 'keyValue', value: 'a'},
			{name: 'startNumber'},
			{name: 'numberChunk', value: '1'},
			{name: 'endNumber'},
			{name: 'numberValue', value: '1'},
			{name: 'startKey'},
			{name: 'stringChunk', value: 'b'},
			{name: 'endKey'},
			{name: 'keyValue', value: 'b'},
			{name: 'trueValue', value: true},
			{name: 'startKey'},
			{name: 'stringChunk', value: 'c'},
			{name: 'endKey'},
			{name: 'keyValue', value: 'c'},
			{name: 'startArray'},
			{name: 'startString'},
			{name: 'stringChunk', value: 'fo'},
			{name: 'stringChunk', value: 'o'},
			{name: 'endString'},
			{name: 'stringValue', value: 'foo'},
			{name: 'endArray'},
			{name: 'startKey'},
			{name: 'stringChunk', value: 'd'},
			{name: 'endKey'},
			{name: 'keyValue', value: 'd'},
			{name: 'startObject'},
			{name: 'startKey'},
			{name: 'stringChunk', value: 'e'},
			{name: 'endKey'},
			{name: 'keyValue', value: 'e'},
			{name: 'nullValue', value: null},
			{name: 'startKey'},
			{name: 'stringChunk', value: 'f'},
			{name: 'endKey'},
			{name: 'keyValue', value: 'f'},
			{name: 'startArray'},
			{name: 'startNumber'},
			{name: 'numberChunk', value: '1'},
			{name: 'endNumber'},
			{name: 'numberValue', value: '1'},
			{name: 'startNumber'},
			{name: 'numberChunk', value: '2'},
			{name: 'endNumber'},
			{name: 'numberValue', value: '2'},
			{name: 'startNumber'},
			{name: 'numberChunk', value: '3'},
			{name: 'endNumber'},
			{name: 'numberValue', value: '3'},
			{name: 'endArray'},
			{name: 'endObject'},
			{name: 'endObject'}
		]);
	});

	it('should successfully parse JSON chunks with escaped fields', () => {
		const
			parser = new Parser();

		const input = {
			stringWithTabsAndNewlines: "Did it work?\nNo...\t\tI don't think so...",
			array: [1, 2, true, 'tabs?\t\t\t\u0001\u0002\u0003', false]
		};

		const
			iter = createChunkIterator(input, 10),
			res = [];

		for (const chunk of iter) {
			for (const el of parser.processChunk(chunk)) {
				res.push(el);
			}
		}

		expect(res).toEqual([
			{name: 'startObject'},
			{name: 'startKey'},
			{name: 'stringChunk', value: 'stringWi'},
			{name: 'stringChunk', value: 'thTabsAndN'},
			{name: 'stringChunk', value: 'ewlines'},
			{name: 'endKey'},
			{name: 'keyValue', value: 'stringWithTabsAndNewlines'},
			{name: 'startString'},
			{name: 'stringChunk', value: 'Did it wor'},
			{name: 'stringChunk', value: 'k?'},
			{name: 'stringChunk', value: '\n'},
			{name: 'stringChunk', value: 'No...'},
			{name: 'stringChunk', value: '\t'},
			{name: 'stringChunk', value: '\t'},
			{name: 'stringChunk', value: "I don't"},
			{name: 'stringChunk', value: ' think so.'},
			{name: 'stringChunk', value: '..'},
			{name: 'endString'},
			{name: 'stringValue', value: "Did it work?\nNo...\t\tI don't think so..."},
			{name: 'startKey'},
			{name: 'stringChunk', value: 'array'},
			{name: 'endKey'},
			{name: 'keyValue', value: 'array'},
			{name: 'startArray'},
			{name: 'startNumber'},
			{name: 'numberChunk', value: '1'},
			{name: 'endNumber'},
			{name: 'numberValue', value: '1'},
			{name: 'startNumber'},
			{name: 'numberChunk', value: '2'},
			{name: 'endNumber'},
			{name: 'numberValue', value: '2'},
			{name: 'trueValue', value: true},
			{name: 'startString'},
			{name: 'stringChunk', value: 'tabs?'},
			{name: 'stringChunk', value: '\t'},
			{name: 'stringChunk', value: '\t'},
			{name: 'stringChunk', value: '\t'},
			{name: 'stringChunk', value: '\x01'},
			{name: 'stringChunk', value: '\x02'},
			{name: 'stringChunk', value: '\x03'},
			{name: 'endString'},
			{name: 'stringValue', value: 'tabs?\t\t\t\x01\x02\x03'},
			{name: 'falseValue', value: false},
			{name: 'endArray'},
			{name: 'endObject'}
		]);
	});

	it('should throw an error if a JSON chunk is invalid', () => {
		const
			parser = new Parser(),
			res = [];

		const
			input = '{"key1":1}garbage{"key3":2}',
			iter = createChunkIterator(input);

		expect(iterate).toThrow(new SyntaxError('Can\'t parse the input: unexpected characters'));

		function iterate() {
			for (const chunk of iter) {
				for (const el of parser.processChunk(chunk)) {
					res.push(el);
				}
			}
		}
	});

	it("should throw an error if double quotes don't wrap a JSON object key", () => {
		const
			parser = new Parser(),
			res = [];

		const
			input = '{key: 1}',
			iter = createChunkIterator(input);

		expect(iterate).toThrow(new SyntaxError("Can't parse the input: expected an object key"));

		function iterate() {
			for (const chunk of iter) {
				for (const el of parser.processChunk(chunk)) {
					res.push(el);
				}
			}
		}
	});

	it('should throw an error if single quotes wrap a JSON object key', () => {
		const
			parser = new Parser(),
			res = [];

		const
			input = "{'key': 1}",
			iter = createChunkIterator(input);

		expect(iterate).toThrow(new SyntaxError("Can't parse the input: expected an object key"));

		function iterate() {
			for (const chunk of iter) {
				for (const el of parser.processChunk(chunk)) {
					res.push(el);
				}
			}
		}
	});
});

function createChunkIterator(input, step = 1) {
	const
		data = typeof input === 'string' ? input : JSON.stringify(input);

	let
		index = 0;

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
