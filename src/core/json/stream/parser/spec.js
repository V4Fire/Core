/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { Parser } from 'core/json/stream/parser';

function createIterator(input, quant = 1) {
	const data = typeof input === 'string' ? input : JSON.stringify(input);
	let index = 0;

	return {
		[Symbol.iterator]() {
			return {
				next() {
					const start = index;
					index += quant;

					return {
						value: data.substring(start, index),
						done: start > data.length
					};
				}
			};
		}
	};
}

describe('Json parser', () => {
	const input = {a: 1, b: true, c: ['d']};

	for (let i = 1; i < 7; i++) {
		it(`should parse json stream to tokens with quant ${i}`, () => {
			const parser = new Parser();
			const iter = createIterator(input, i);
			const result = [];

			for (const chunk of iter) {
				for (const el of parser.processChunk(chunk)) {
					result.push(el);
				}
			}

			expect(result.length).toEqual(25);
		});
	}

	it('should successfully parse json with escaped fields', () => {
		const parser = new Parser();

		const input = {
			stringWithTabsAndNewlines: "Did it work?\nNo...\t\tI don't think so...",
			anArray: [1, 2, true, 'tabs?\t\t\t\u0001\u0002\u0003', false]
		};

		const iter = createIterator(input, 1);
		const result = [];

		for (const chunk of iter) {
			for (const el of parser.processChunk(chunk)) {
				result.push(el);
			}
		}

		expect(result.length).toBe(108);
	});

	it('should throw error if json invalid', () => {
		const parser = new Parser();

		const input = '{"key1":1}garbage{"key3":2}';
		const iter = createIterator(input, 1);
		const result = [];

		expect(function iterate() {
			for (const chunk of iter) {
				for (const el of parser.processChunk(chunk)) {
					result.push(el);
				}
			}
		}).toThrow(new Error('Parser cannot parse input: unexpected characters'));
	});
});
