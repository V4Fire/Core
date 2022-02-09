/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/json/stream/README.md]]
 * @packageDocumentation
 */

import type { Parser } from 'core/json/stream/parser';
import type { JsonToken, PARENT_STATE } from 'core/json/stream/interface';
import { PARSER_STATE, PARSER_DONE, PARSER_EXPECTED } from 'core/json/stream/const';

export function* stop(this: Parser): Generator<JsonToken> {
	this.patterns.comma.lastIndex = this.index;
	this.match = this.patterns.comma.exec(this.buffer);

	if (!this.match) {
		if (this.index < this.buffer.length) {
			throw new Error("Parser cannot parse input: expected ','");
		}

		return PARSER_DONE;
	}

	if (this.openNumber) {
		yield {name: 'endNumber'};
		this.openNumber = false;

		yield {name: 'numberValue', value: this.accumulator};
		this.accumulator = '';
	}

	this.value = this.match[0];

	if (this.value === ',') {
		this.expect = this.expect === PARSER_STATE.ARRAY_STOP ? PARSER_STATE.VALUE : 'key';

	} else if (this.value === '}' || this.value === ']') {
		yield {name: this.value === '}' ? 'endObject' : 'endArray'};
		this.parent = <PARENT_STATE>this.stack.pop();
		this.expect = PARSER_EXPECTED[this.parent];
	}

	this.index += this.value.length;
}
