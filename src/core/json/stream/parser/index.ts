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

import { parserStateTypes, parserPatterns, PARSING_COMPLETE } from 'core/json/stream/const';

import { parserStates } from 'core/json/stream/parser/states';
import type { ParserState, ParentParserState, JsonToken } from 'core/json/stream/interface';

export default class Parser {
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
	protected match?: RegExpExecArray | null;

	/**
	 * The next expected chunk in a stream
	 */
	protected expect: ParserState = parserStateTypes.VALUE;

	/**
	 * Dictionary with RegExp-s to different types of data
	 */
	protected patterns: Record<string, RegExp> = parserPatterns;

	/**
	 * Is the parser parsing a number now
	 */
	protected isOpenNumber: boolean = false;

	/**
	 * Processes the passed JSON chunk and yields tokens
	 * @param chunk
	 */
	*processChunk(chunk: string): Generator<JsonToken> {
		this.buffer += chunk;
		this.match = null;
		this.value = '';
		this.index = 0;

		while (true) {
			const
				handler = parserStates[this.expect],
				iter: Generator<JsonToken> = handler.call(this);

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
