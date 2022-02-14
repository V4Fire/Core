/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Parser from 'core/json/stream/parser';

import { parserStates, parserStateTypes, parserExpected, PARSING_COMPLETE } from 'core/json/stream/const';
import type { JsonToken } from 'core/json/stream/interface';

/**
 * Parses the buffer for a numeric fraction symbol `[\.eE]?` and generates a token `numberChunk` with a fraction symbol
 */
export function* numberFraction(this: Parser): Generator<JsonToken> {
	this.patterns.numberFraction.lastIndex = this.index;
	this.matched = this.patterns.numberFraction.exec(this.buffer);

	if (this.matched == null) {
		if (this.index < this.buffer.length) {
			this.expected = parserExpected[this.parent];
			return;
		}

		return PARSING_COMPLETE;
	}

	this.value = this.matched[0];

	yield {
		name: 'numberChunk',
		value: this.value
	};

	this.accumulator += this.value;
	this.expected = this.value === '.' ? parserStateTypes.NUMBER_FRACTION_START : parserStateTypes.NUMBER_EXP_SIGN;

	this.index += this.value.length;
}

parserStates[parserStateTypes.NUMBER_FRACTION] = numberFraction;
