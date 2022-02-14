/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Parser from 'core/json/stream/parser';

import { parserStates, parserStateTypes, PARSING_COMPLETE } from 'core/json/stream/const';
import type { Token } from 'core/json/stream/interface';

/**
 * Parses the buffer for number fraction digits `[0-9]` and generates a token `numberChunk` with a fraction value
 */
export function* numberFractionDigit(this: Parser): Generator<Token> {
	this.patterns.numberFracDigit.lastIndex = this.index;
	this.matched = this.patterns.numberFracDigit.exec(this.buffer);
	this.value = this.matched?.[0];

	if (this.value != null) {
		yield {
			name: 'numberChunk',
			value: this.value
		};

		this.accumulator += this.value;
		this.index += this.value.length;

	} else {
		if (this.index < this.buffer.length) {
			this.expected = parserStateTypes.NUMBER_EXPONENT;
			return;
		}

		return PARSING_COMPLETE;
	}
}

parserStates[parserStateTypes.NUMBER_FRACTION_DIGIT] = numberFractionDigit;
