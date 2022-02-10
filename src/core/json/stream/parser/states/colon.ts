/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Parser } from 'core/json/stream/parser';
import type { JsonToken } from 'core/json/stream/interface';
import { PARSER_STATE, PARSER_DONE, PARSER_STATES } from 'core/json/stream/const';

/**
 * Parse buffer for colon and set expected element to object value
 */
// eslint-disable-next-line require-yield
export function* colon(this: Parser): Generator<JsonToken> {
	this.patterns.colon.lastIndex = this.index;
	this.match = this.patterns.colon.exec(this.buffer);

	if (!this.match) {
		if (this.index < this.buffer.length) {
			throw new Error("Parser cannot parse input: expected ':'");
		}

		return PARSER_DONE;
	}

	this.value = this.match[0];
	this.value === ':' && (this.expect = PARSER_STATE.VALUE);

	this.index += this.value.length;
}

PARSER_STATES[PARSER_STATE.COLON] = colon;
