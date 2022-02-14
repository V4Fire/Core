/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Parser from 'core/json/stream/parser';
import type { Token } from 'core/json/stream/interface';
import { parserStates, parserStateTypes, parserExpected, PARSING_COMPLETE } from 'core/json/stream/const';

/**
 * Parses the buffer for an exponent symbol `[eE]?` and generates a token `numberChunk` with a symbol value
 */
export function* numberExponent(this: Parser): Generator<Token> {
	this.patterns.numberExponent.lastIndex = this.index;
	this.matched = this.patterns.numberExponent.exec(this.buffer);

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
	this.expected = parserStateTypes.NUMBER_EXP_SIGN;

	this.index += this.value.length;
}

parserStates[parserStateTypes.NUMBER_EXPONENT] = numberExponent;
