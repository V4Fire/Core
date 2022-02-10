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
 * Parse buffer and generate from the digits [0-9]* token `numberChunk` with number value
 */
export function* numberDigit(this: Parser): Generator<JsonToken> {
	this.patterns.numberDigit.lastIndex = this.index;
	this.match = this.patterns.numberDigit.exec(this.buffer);

	if (!this.match) {
		if (this.index < this.buffer.length) {
			throw new Error('Parser cannot parse input: expected a digit');
		}

		return PARSER_DONE;
	}

	this.value = this.match[0];

	if (this.value.length > 0) {
		yield {name: 'numberChunk', value: this.value};

		this.accumulator += this.value;

		this.index += this.value.length;

	} else {
		if (this.index < this.buffer.length) {
			this.expect = PARSER_STATE.NUMBER_FRACTION;
			return;
		}

		return PARSER_DONE;
	}
}

PARSER_STATES[PARSER_STATE.NUMBER_DIGIT] = numberDigit;
