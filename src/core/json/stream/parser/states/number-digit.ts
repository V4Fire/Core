/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Parser from 'core/json/stream/parser';

import { parserStates, parserStateTypes, PARSING_COMPLETE } from 'core/json/stream/const';
import type { JsonToken } from 'core/json/stream/interface';

/**
 * Parses the buffer and generates from digits `[0-9]*` a token `numberChunk` with a number value
 */
export function* numberDigit(this: Parser): Generator<JsonToken> {
	this.patterns.numberDigit.lastIndex = this.index;
	this.match = this.patterns.numberDigit.exec(this.buffer);

	if (this.match == null) {
		if (this.index < this.buffer.length) {
			throw new SyntaxError("Can't parse the input: expected a digit");
		}

		return PARSING_COMPLETE;
	}

	this.value = this.match[0];

	if (this.value.length > 0) {
		yield {
			name: 'numberChunk',
			value: this.value
		};

		this.accumulator += this.value;
		this.index += this.value.length;

	} else {
		if (this.index < this.buffer.length) {
			this.expect = parserStateTypes.NUMBER_FRACTION;
			return;
		}

		return PARSING_COMPLETE;
	}
}

parserStates[parserStateTypes.NUMBER_DIGIT] = numberDigit;
