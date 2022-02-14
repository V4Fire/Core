/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/* eslint-disable require-yield */

import type Parser from 'core/json/stream/parser';

import { parserStates, parserStateTypes, PARSING_COMPLETE } from 'core/json/stream/const';
import type { JsonToken } from 'core/json/stream/interface';

/**
 * Parses the buffer for a colon and sets the expected element to a parser expect value
 */
export function* colon(this: Parser): Generator<JsonToken> {
	this.patterns.colon.lastIndex = this.index;
	this.matched = this.patterns.colon.exec(this.buffer);

	if (this.matched == null) {
		if (this.index < this.buffer.length) {
			throw new SyntaxError("Can't parse the input: expected ':'");
		}

		return PARSING_COMPLETE;
	}

	this.value = this.matched[0];

	if (this.value === ':') {
		this.expected = parserStateTypes.VALUE;
	}

	this.index += this.value.length;
}

parserStates[parserStateTypes.COLON] = colon;
