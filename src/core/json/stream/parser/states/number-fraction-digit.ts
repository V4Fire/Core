/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Parser } from 'core/json/stream/parser';
import type { JsonToken } from 'core/json/stream/interface';
import { PARSER_DONE, PARSER_STATES, PARSER_STATE } from 'core/json/stream/const';

/**
 * Parse buffer for number fraction digits [0-9]
 * and generate token `numberChunk` with fraction value
 */
export function* numberFractionDigit(this: Parser): Generator<JsonToken> {
	this.patterns.numberFracDigit.lastIndex = this.index;
	this.match = this.patterns.numberFracDigit.exec(this.buffer);
	this.value = this.match?.[0];

	if (this.value != null) {
		yield {name: 'numberChunk', value: this.value};

		this.accumulator += this.value;

		this.index += this.value.length;

	} else {
		if (this.index < this.buffer.length) {
			this.expect = PARSER_STATE.NUMBER_EXPONENT;
			return;
		}

		return PARSER_DONE;
	}
}

PARSER_STATES[PARSER_STATE.NUMBER_FRACTION_DIGIT] = numberFractionDigit;
