/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { PARSER_PATTERNS, PARSER_DONE, PARSER_STATES } from 'core/json/stream/const';
import { PARSER_STATE } from 'core/json/stream/parser/states';
import type { TPARSER_STATE, PARENT_STATE, JsonToken } from 'core/json/stream/interface';

export class Parser {
	/**
	 * Next expected chunk in stream
	 */
	protected expect: TPARSER_STATE = PARSER_STATE.VALUE;

	/**
	 * An array of parent objects for a current parsed structure
	 */
	protected readonly stack: PARENT_STATE[] = [];

	/**
	 * Current parent of parsed structure
	 */
	protected parent: PARENT_STATE = PARSER_STATE.EMPTY;

	/**
	 * Is parser parsing number now
	 */
	protected openNumber: boolean = false;

	/**
	 * Accumulator for current parsed structure
	 */
	protected accumulator: string = '';

	/**
	 * Current piece of JSON
	 */
	protected buffer: string = '';

	/**
	 * Current match value after regExp execution
	 */
	protected match?: RegExpExecArray | null;

	/**
	 * Current parsed value
	 */
	protected value?: string = '';

	/**
	 * Current index in buffer parsing process
	 */
	protected index: number = 0;

	/**
	 * Collection of regExps for parsing
	 * different types of data
	 */
	protected patterns: Record<string, RegExp> = PARSER_PATTERNS;

	/**
	 * Process piece of JSON and yield tokens
	 *
	 * @param chunk
	 */
	*processChunk(chunk: string): Generator<JsonToken> {
		this.buffer += chunk;
		this.match = null;
		this.value = '';
		this.index = 0;

		while (true) {
			const handler = PARSER_STATES[this.expect];
			const iter: Generator<JsonToken> = handler.call(this);
			let result;

			while (true) {
				const val = iter.next();

				if (val.done) {
					result = val.value;
					break;

				} else {
					yield val.value;
				}
			}

			if (result === PARSER_DONE) {
				break;
			}
		}

		this.buffer = this.buffer.slice(this.index);
	}
}
