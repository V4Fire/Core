/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Parser } from 'core/json/stream/parser';
import type { JsonToken, PARENT_STATE } from 'core/json/stream/interface';
import { PARSER_STATE, PARSER_DONE, PARSER_EXPECTED, PARSER_STATES } from 'core/json/stream/const';

/**
 * Parse buffer for object key and generate token `startKey`
 * or if object ended generate `endObject` token
 */
export function* key(this: Parser): Generator<JsonToken> {
	this.patterns.key1.lastIndex = this.index;
	this.match = this.patterns.key1.exec(this.buffer);

	if (!this.match) {
		if (this.index < this.buffer.length) {
			throw new Error('Parser cannot parse input: expected an object key');
		}

		return PARSER_DONE;
	}

	this.value = this.match[0];

	if (this.value === '"') {
		yield {name: 'startKey'};
		this.expect = PARSER_STATE.KEY_VAL;

	} else if (this.value === '}') {
		if (this.expect !== PARSER_STATE.KEY1) {
			throw new Error("Parser cannot parse input: unexpected token '}'");
		}

		yield {name: 'endObject'};
		this.parent = <PARENT_STATE>this.stack.pop();
		this.expect = PARSER_EXPECTED[this.parent];
	}

	this.index += this.value.length;
}

PARSER_STATES[PARSER_STATE.KEY] = key;
PARSER_STATES[PARSER_STATE.KEY1] = key;
