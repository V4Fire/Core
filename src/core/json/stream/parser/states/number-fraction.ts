/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Parser } from 'core/json/stream/parser';
import type { JsonToken } from 'core/json/stream/interface';
import { PARSER_DONE, PARSER_EXPECTED, PARSER_STATES, PARSER_STATE } from 'core/json/stream/const';

/**
 * Parse buffer for number fraction symbol [\.eE]?
 * and generate token `numberChunk` with fraction symbol
 */
export function* numberFraction(this: Parser): Generator<JsonToken> {
	this.patterns.numberFraction.lastIndex = this.index;
	this.match = this.patterns.numberFraction.exec(this.buffer);

	if (!this.match) {
		if (this.index < this.buffer.length) {
			this.expect = PARSER_EXPECTED[this.parent];
			return;
		}

		return PARSER_DONE;
	}

	this.value = this.match[0];

	yield {name: 'numberChunk', value: this.value};

	this.accumulator += this.value;
	this.expect = this.value === '.' ? PARSER_STATE.NUMBER_FRACTION_START : PARSER_STATE.NUMBER_EXP_SIGN;

	this.index += this.value.length;
}

PARSER_STATES[PARSER_STATE.NUMBER_FRACTION] = numberFraction;
