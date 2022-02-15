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
 * Parses the buffer, adds tokens to close a numeric chunk if needed, and finishes the parsing
 */
export function* done(this: Parser): Generator<Token> {
	this.patterns.ws.lastIndex = this.index;
	this.matched = this.patterns.ws.exec(this.buffer);

	if (this.isOpenNumber) {
		yield {name: 'endNumber'};
		this.isOpenNumber = false;

		yield {
			name: 'numberValue',
			value: this.accumulator
		};

		this.accumulator = '';
	}

	if (this.matched == null) {
		if (this.index < this.buffer.length) {
			throw new SyntaxError("Can't parse the input: unexpected characters");
		}

		return PARSING_COMPLETE;
	}

	this.value = this.matched[0];
	this.index += this.value.length;
}

parserStates[parserStateTypes.DONE] = done;
