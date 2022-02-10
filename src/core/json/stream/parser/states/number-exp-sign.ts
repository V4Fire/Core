/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Parser } from 'core/json/stream/parser';
import type { JsonToken } from 'core/json/stream/interface';
import { PARSER_DONE, PARSER_STATES, PARSER_STATE } from 'core/json/stream/const';

/**
 * Parse buffer for exp signs [-+]?*
 * and generate token `numberChunk` with sign
 */
export function* numberExpSign(this: Parser): Generator<JsonToken> {
	this.patterns.numberExpSign.lastIndex = this.index;
	this.match = this.patterns.numberExpSign.exec(this.buffer);

	if (!this.match) {
		if (this.index < this.buffer.length) {
			this.expect = PARSER_STATE.NUMBER_EXP_START;
			return;
		}

		return PARSER_DONE;
	}

	this.value = this.match[0];

	yield {name: 'numberChunk', value: this.value};

	this.accumulator += this.value;
	this.expect = PARSER_STATE.NUMBER_EXP_START;

	this.index += this.value.length;
}

PARSER_STATES[PARSER_STATE.NUMBER_EXP_SIGN] = numberExpSign;
