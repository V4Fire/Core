/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Parser from 'core/json/stream/parser';

import { parserStates, parserStateTypes, parserExpected } from 'core/json/stream/parser/const';
import type { Token } from 'core/json/stream/parser/interface';

/**
 * Parses the buffer for a digit expression `[0-9]*` and generates a token `numberChunk` with a number value
 */
export function* numberExpDigit(this: Parser): Generator<Token> {
	this.patterns.numberExpDigit.lastIndex = this.index;
	this.matched = this.patterns.numberExpDigit.exec(this.buffer);
	this.value = this.matched?.[0];

	if (this.value != null && this.value !== '') {
		yield {
			name: 'numberChunk',
			value: this.value
		};

		this.accumulator += this.value;
		this.index += this.value.length;

	} else {
		this.expected = parserExpected[this.parent];
	}
}

parserStates[parserStateTypes.NUMBER_EXP_DIGIT] = numberExpDigit;
