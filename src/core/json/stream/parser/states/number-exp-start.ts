/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Parser from 'core/json/stream/parser';

import { parserStates, parserStateTypes, PARSING_COMPLETE } from 'core/json/stream/parser/const';
import type { Token } from 'core/json/stream/parser/interface';

/**
 * Parses the buffer for the first digit `[0-9]` in a numeric expression and
 * generates a token `numberChunk` with a digit value
 */
export function* numberExpStart(this: Parser): Generator<Token> {
	this.patterns.numberExpStart.lastIndex = this.index;
	this.matched = this.patterns.numberExpStart.exec(this.buffer);

	if (this.matched == null) {
		if (this.index < this.buffer.length) {
			throw new SyntaxError("Can't parse the input: expected an exponent part of a number");
		}

		return PARSING_COMPLETE;
	}

	this.value = this.matched[0];

	yield {
		name: 'numberChunk',
		value: this.value
	};

	this.accumulator += this.value;
	this.expected = parserStateTypes.NUMBER_EXP_DIGIT;

	this.index += this.value.length;
}

parserStates[parserStateTypes.NUMBER_EXP_START] = numberExpStart;
