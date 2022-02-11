/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { Parser } from 'core/json/stream/parser';

describe('core/json/stream/parser', () => {
	const
		input = {a: 1, b: true, c: ['d']};

	for (let i = 1; i < 7; i++) {
		it(`should parse a JSON stream to tokens with the specified quantity ${i}`, () => {
			const
				parser = new Parser(),
				iter = createIterator(input, i),
				res = [];

			for (const chunk of iter) {
				for (const el of parser.processChunk(chunk)) {
					res.push(el);
				}
			}

			expect(res.length).toEqual(25);
		});
	}

	it('should successfully parse a JSON stream with escaped fields', () => {
		const
			parser = new Parser();

		const input = {
			stringWithTabsAndNewlines: "Did it work?\nNo...\t\tI don't think so...",
			anArray: [1, 2, true, 'tabs?\t\t\t\u0001\u0002\u0003', false]
		};

		const
			iter = createIterator(input, 1),
			res = [];

		for (const chunk of iter) {
			for (const el of parser.processChunk(chunk)) {
				res.push(el);
			}
		}

		expect(res.length).toBe(108);
	});

	it('should throw an error if JSON is invalid', () => {
		const
			parser = new Parser();

		const
			input = '{"key1":1}garbage{"key3":2}',
			iter = createIterator(input, 1),
			res = [];

		expect(function iterate() {
			for (const chunk of iter) {
				for (const el of parser.processChunk(chunk)) {
					res.push(el);
				}
			}
		}).toThrow(new SyntaxError("Can't parse the input: unexpected characters"));
	});
});

function createIterator(input, quantity = 1) {
	const
		data = typeof input === 'string' ? input : JSON.stringify(input);

	let
		index = 0;

	return {
		[Symbol.iterator]() {
			return {
				next() {
					const start = index;
					index += quantity;

					return {
						value: data.substring(start, index),
						done: start > data.length
					};
				}
			};
		}
	};
}
