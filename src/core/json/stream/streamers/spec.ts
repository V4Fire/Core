/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Parser from 'core/json/stream/parser';

import { Pick } from 'core/json/stream/filters';
import { ArrayStreamer, ObjectStreamer } from 'core/json/stream/streamers';

describe('core/json/stream/streamers', () => {
	describe('`ArrayStreamer`', () => {
		it('should stream an array', async () => {
			const data = `{
				"a": {
					"b": [{"a": 1}, 1.34E-1, [2], true]
				},

				"c": 2
			}`;

			const
				tokens = [];

			for await (const token of Parser.from([data], new Pick('a.b'), new ArrayStreamer())) {
				tokens.push(token);
			}

			expect(tokens).toEqual([
				{index: 0, value: {a: 1}},
				{index: 1, value: 0.134},
				{index: 2, value: [2]},
				{index: 3, value: true}
			]);
		});

		it('should stream nothing if the source array is empty', async () => {
			const
				tokens = [];

			for await (const token of Parser.from(['[]'], new ArrayStreamer())) {
				tokens.push(token);
			}

			expect(tokens).toEqual([]);
		});

		it('should throw an error if the streamed data is not an array', async () => {
			let
				err;

			const
				tokens = [];

			try {
				for await (const token of Parser.from(['{"a": 1}'], new ArrayStreamer())) {
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

			const
				tokens = [];

			for await (const token of Parser.from([data], new ObjectStreamer())) {
				tokens.push(token);
			}

			expect(tokens).toEqual([
				{key: 'a', value: {b: 2}},
				{key: 'c', value: 2}
			]);
		});

		it('should stream nothing if the source object is empty', async () => {
			const
				tokens = [];

			for await (const token of Parser.from(['{}'], new ObjectStreamer())) {
				tokens.push(token);
			}

			expect(tokens).toEqual([]);
		});

		it('should throw an error if the streamed data is not an object', async () => {
			let
				err;

			const
				tokens = [];

			try {
				for await (const token of Parser.from(['[1,2]'], new ObjectStreamer())) {
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
