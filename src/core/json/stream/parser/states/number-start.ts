/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Parser } from 'core/json/stream/parser';
import type { JsonToken } from 'core/json/stream/interface';
import { PARSER_STATE, PARSER_DONE, PARSER_STATES } from 'core/json/stream/const';

/**
 * Parse buffer for number digits [0-9] and generate token `numberChunk` with number
 */
export function* numberStart(this: Parser): Generator<JsonToken> {
	this.patterns.numberStart.lastIndex = this.index;
	this.match = this.patterns.numberStart.exec(this.buffer);

	if (!this.match) {
		if (this.index < this.buffer.length) {
			throw new Error('Parser cannot parse input: expected a starting digit');
		}

		return PARSER_DONE;
	}

	this.value = this.match[0];

	yield {name: 'numberChunk', value: this.value};

	this.accumulator += this.value;
	this.expect = this.value === '0' ? PARSER_STATE.NUMBER_FRACTION : PARSER_STATE.NUMBER_DIGIT;

	this.index += this.value.length;
}

PARSER_STATES[PARSER_STATE.NUMBER_START] = numberStart;
