/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Parser } from 'core/json/stream/parser';
import type { JsonToken } from 'core/json/stream/interface';
import { PARSER_CODES, PARSER_DONE, PARSER_EXPECTED, PARSER_STATES, PARSER_STATE } from 'core/json/stream/const';
import { fromHex } from 'core/json/stream/helpers';

/**
 * Parse buffer for the end of key or string
 * and generate the sequence of tokens
 * `endKey`, `keyValue` for key and
 * `endString`, `stringValue` and `stringChunk` for string
 */
export function* string(this: Parser): Generator<JsonToken> {
	this.patterns.string.lastIndex = this.index;
	this.match = this.patterns.string.exec(this.buffer);

	if (!this.match) {
		if (this.index < this.buffer.length && (this.buffer.length - this.index >= 6)) {
			throw new Error('Parser cannot parse input: escaped characters');
		}

		return PARSER_DONE;
	}

	this.value = this.match[0];

	if (this.value === '"') {
		if (this.expect === PARSER_STATE.KEY_VAL) {
			yield {name: 'endKey'};
			yield {name: 'keyValue', value: this.accumulator};

			this.accumulator = '';
			this.expect = PARSER_STATE.COLON;

		} else {
			yield {name: 'endString'};
			yield {name: 'stringValue', value: this.accumulator};

			this.accumulator = '';
			this.expect = PARSER_EXPECTED[this.parent];
		}

	} else if (this.value.length > 1 && this.value.startsWith('\\')) {
		const t = this.value.length === 2 ? PARSER_CODES[this.value.charAt(1)] : fromHex(this.value);
		yield {name: 'stringChunk', value: t};
		this.accumulator += t;

	} else {
		yield {name: 'stringChunk', value: this.value};

		this.accumulator += this.value;
	}

	this.index += this.value.length;
}

PARSER_STATES[PARSER_STATE.STRING] = string;
PARSER_STATES[PARSER_STATE.KEY_VAL] = string;
