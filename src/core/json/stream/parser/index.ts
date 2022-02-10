/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { PARSER_STATE, PARSER_PATTERNS, PARSER_DONE } from 'core/json/stream/const';
import type { TPARSER_STATE, PARENT_STATE, JsonToken } from 'core/json/stream/interface';
import * as parser from 'core/json/stream/parser/states';

const handlers = {
	[PARSER_STATE.VALUE]: parser.value,
	[PARSER_STATE.VALUE1]: parser.value,
	[PARSER_STATE.KEY1]: parser.key,
	[PARSER_STATE.KEY]: parser.key,
	[PARSER_STATE.KEY_VAL]: parser.string,
	[PARSER_STATE.STRING]: parser.string,
	[PARSER_STATE.COLON]: parser.colon,
	[PARSER_STATE.ARRAY_STOP]: parser.stop,
	[PARSER_STATE.OBJECT_STOP]: parser.stop,
	// Number chunks
	// [0-9]
	[PARSER_STATE.NUMBER_START]: parser.numberStart,
	// [0-9]*
	[PARSER_STATE.NUMBER_DIGIT]: parser.numberDigit,
	// [\.eE]?
	[PARSER_STATE.NUMBER_FRACTION]: parser.numberFraction,
	// [0-9]
	[PARSER_STATE.NUMBER_FRAC_START]: parser.numberFractionStart,
	// [0-9]*
	[PARSER_STATE.NUMBER_FRAC_DIGIT]: parser.numberFractionDigit,
	// [eE]?
	[PARSER_STATE.NUMBER_EXPONENT]: parser.numberExponent,
	// [-+]?
	[PARSER_STATE.NUMBER_EXP_SIGN]: parser.numberExpSign,
	// [0-9]
	[PARSER_STATE.NUMBER_EXP_START]: parser.numberExpStart,
	// [0-9]*
	[PARSER_STATE.NUMBER_EXP_DIGIT]: parser.numberExpDigit,
	[PARSER_STATE.DONE]: parser.done
};

export class Parser {
	protected expect: TPARSER_STATE = PARSER_STATE.VALUE;
	protected readonly stack: PARENT_STATE[] = [];
	protected parent: PARENT_STATE = PARSER_STATE.EMPTY;
	protected openNumber: boolean = false;
	protected accumulator: string = '';
	protected buffer: string = '';
	protected match?: RegExpExecArray | null;
	protected value?: string = '';
	protected index: number = 0;
	protected patterns: Record<string, RegExp> = PARSER_PATTERNS;

	// eslint-disable-next-line complexity, max-lines-per-function
	*processChunk(chunk: string): Generator<JsonToken> {
		this.buffer += chunk;
		this.match = null;
		this.value = '';
		this.index = 0;

		while (true) {
			const handler = handlers[this.expect];
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
