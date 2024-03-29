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
 * Parses the buffer for number digits `[0-9]` and generates a token `numberChunk` with a number
 */
export function* numberStart(this: Parser): Generator<Token> {
	this.patterns.numberStart.lastIndex = this.index;
	this.matched = this.patterns.numberStart.exec(this.buffer);

	if (this.matched == null) {
		if (this.index < this.buffer.length) {
			throw new SyntaxError("Can't parse the input: expected a starting digit");
		}

		return PARSING_COMPLETE;
	}

	this.value = this.matched[0];

	yield {
		name: 'numberChunk',
		value: this.value
	};

	this.accumulator += this.value;
	this.expected = this.value === '0' ? parserStateTypes.NUMBER_FRACTION : parserStateTypes.NUMBER_DIGIT;

	this.index += this.value.length;
}

parserStates[parserStateTypes.NUMBER_START] = numberStart;
