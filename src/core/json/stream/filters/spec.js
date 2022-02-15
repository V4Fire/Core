/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Parser from 'core/json/stream/parser';
import { Filter, Pick } from 'core/json/stream/filters';

describe('core/json/stream/filters', () => {
	describe('`Filter`', () => {
		it('filtering tokens by the specified path', async () => {
			const input = `{
				"a": {
					"b": [1, 2, 3]
				},

				"c": 2
			}`;

			const
				res = [];

			for await (const token of Parser.from([input], new Filter('a.b'))) {
				res.push(token);
			}

			expect(res)
				.toEqual([
					...new Parser().processChunk(`{
					"a": {
						"b": [1, 2, 3]
					}
				}`)
				]);
		});

		it('filtering tokens by the specified RegExp', async () => {
			const
				input = '[{"a": 1}, [1], true, null]',
				res = [];

			for await (const token of Parser.from([input], new Filter(/^[02]\.?/))) {
				res.push(token);
			}

			expect(res)
				.toEqual([...new Parser().processChunk('[{"a": 1}, true]')]);
		});

		it('filtering tokens by the specified function', async () => {
			const
				input = '[{"a": 1}, [1], true, {"a": 2}]',
				res = [];

			for await (const token of Parser.from([input], new Filter((stack) => stack.includes('a')))) {
				res.push(token);
			}

			expect(res)
				.toEqual([...new Parser().processChunk('[{"a": 1}, {"a": 2}]')]);
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

			const
				res = [];

			for await (const token of Parser.from([input], new Pick('a.b'))) {
				res.push(token);
			}

			expect(res).toEqual([...new Parser().processChunk('[1, 2, 3]')]);
		});

		it('picking the first token matched with the specified RegExp', async () => {
			const
				input = '[{"a": 1}, [1], true, null]',
				res = [];

			for await (const token of Parser.from([input], new Pick(/^[02]\.?/))) {
				res.push(token);
			}

			expect(res).toEqual([...new Parser().processChunk('{"a": 1}')]);
		});

		it('picking all tokens matched with the specified RegExp', async () => {
			const
				input = '[{"a": 1}, [1], true, null]',
				res = [];

			for await (const token of Parser.from([input], new Pick(/^[02]\.?/, {multiple: true}))) {
				res.push(token);
			}

			expect(res).toEqual([
				...new Parser().processChunk('{"a": 1}'),
				...new Parser().processChunk('true')
			]);
		});

		it('picking the first token filtered by the specified function', async () => {
			const
				input = '[{"a": 1}, [1], true, {"a": 2}]',
				res = [];

			for await (const token of Parser.from([input], new Pick((stack) => stack.includes('a')))) {
				res.push(token);
			}

			expect(res).toEqual([...new Parser().processChunk('1')]);
		});

		it('picking all tokens filtered by the specified function', async () => {
			const
				input = '[{"a": 1}, [1], true, {"a": 2}]',
				res = [];

			for await (const token of Parser.from([input], new Pick((stack) => stack.includes('a'), {multiple: true}))) {
				res.push(token);
			}

			expect(res).toEqual([
				...new Parser().processChunk('1'),
				...new Parser().processChunk('2')
			]);
		});
	});
});
