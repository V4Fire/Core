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
 * Parses the buffer for signs `[-+]?*` and generates a token `numberChunk` with a sign
 */
export function* numberExpSign(this: Parser): Generator<Token> {
	this.patterns.numberExpSign.lastIndex = this.index;
	this.matched = this.patterns.numberExpSign.exec(this.buffer);

	if (this.matched == null) {
		if (this.index < this.buffer.length) {
			this.expected = parserStateTypes.NUMBER_EXP_START;
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
	this.expected = parserStateTypes.NUMBER_EXP_START;

	this.index += this.value.length;
}

parserStates[parserStateTypes.NUMBER_EXP_SIGN] = numberExpSign;
