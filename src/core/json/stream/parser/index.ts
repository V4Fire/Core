/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/json/stream/parser/README.md]]
 * @packageDocumentation
 */

import { parserStates } from 'core/json/stream/parser/states';
import { parserStateTypes, parserPatterns, PARSING_COMPLETE } from 'core/json/stream/parser/const';

import type {

	ParserState,
	ParentParserState,

	Token,
	TokenProcessor

} from 'core/json/stream/parser/interface';

export * from 'core/json/stream/parser/const';
export * from 'core/json/stream/parser/interface';

export default class Parser {
	/**
	/**
	 * Parses the specified iterable object as a JSON stream and yields tokens via a Generator
	 *
	 * @param source
	 * @param [filters] - list of token processors to apply to the output iterable
	 */
	static async*from(source: Iterable<string>, ...filters: TokenProcessor[]): AsyncGenerator<Token> {
		filters = filters.slice();

		const
			parser = new Parser();

		for await (const chunk of source) {
			let
				tokens = <IterableIterator<Token>>parser.processChunk(chunk);

			while (filters.length > 0) {
				const
					newTokens = <Token[]>[],
					filter = filters.shift();

				if (filter == null) {
					continue;
				}

				for (const token of tokens) {
					newTokens.push(...filter.processToken(token));
				}

				if (filter.finishTokenProcessing != null) {
					for (const token of filter.finishTokenProcessing()) {
						newTokens.push(token);
					}
				}

				tokens = newTokens.values();
			}

			for (const token of tokens) {
				yield token;
			}
		}
	}

	/**
	 * The current parent of a parsed structure
	 */
	protected parent: ParentParserState = parserStateTypes.EMPTY;

	/**
	 * An array of parent objects for the current parsed structure
	 */
	protected readonly stack: ParentParserState[] = [];

	/**
	 * The current piece of JSON
	 */
	protected buffer: string = '';

	/**
	 * Accumulator for the current parsed structure
	 */
	protected accumulator: string = '';

	/**
	 * The current parsed value
	 */
	protected value?: string = '';

	/**
	 * The current index in a buffer parsing process
	 */
	protected index: number = 0;

	/**
	 * The current match value after RegExp execution
	 */
	protected matched?: RegExpExecArray | null;

	/**
	 * The next expected parser state from a stream
	 */
	protected expected: ParserState = parserStateTypes.VALUE;

	/**
	 * Dictionary with RegExp-s to different types of data
	 */
	protected patterns: Record<string, RegExp> = parserPatterns;

	/**
	 * Is the parser parsing a number now
	 */
	protected isOpenNumber: boolean = false;

	/**
	 * Processes the passed JSON chunk and yields tokens via an asynchronous Generator
	 * @param chunk
	 */
	*processChunk(chunk: string): Generator<Token> {
		this.buffer += chunk;
		this.matched = null;

		this.value = '';
		this.index = 0;

		while (true) {
			const
				handler = parserStates[this.expected],
				iter: Generator<Token> = handler.call(this);

			let
				res;

			while (true) {
				const
					val = iter.next();

				if (val.done) {
					res = val.value;
					break;

				} else {
					yield val.value;
				}
			}

			if (res === PARSING_COMPLETE) {
				break;
			}
		}

		this.buffer = this.buffer.slice(this.index);
	}
}
