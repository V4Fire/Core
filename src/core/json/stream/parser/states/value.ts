/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Parser } from 'core/json/stream/parser';
import type { JsonToken, PARENT_STATE } from 'core/json/stream/interface';
import { MAX_PATTERN_SIZE, PARSER_STATE, PARSER_VALUES, PARSER_DONE, PARSER_EXPECTED, PARSER_STATES } from 'core/json/stream/const';

/**
 * Parse buffer for value, generate the sequence of tokens
 * and set the next expected value
 */
export function* value(this: Parser): Generator<JsonToken> {
	this.patterns.value1.lastIndex = this.index;
	this.match = this.patterns.value1.exec(this.buffer);

	if (!this.match) {
		if (this.index + MAX_PATTERN_SIZE < this.buffer.length) {
			if (this.index < this.buffer.length) {
				throw new Error('Parser cannot parse input: expected a value');
			}

			throw new Error('Parser has expected a value');
		}

		return PARSER_DONE;
	}

	this.value = this.match[0];

	// eslint-disable-next-line default-case
	switch (this.value) {
		case '"':
			yield {name: 'startString'};

			this.expect = PARSER_STATE.STRING;
			break;

		case '{':
			yield {name: 'startObject'};

			this.stack.push(this.parent);
			this.parent = PARSER_STATE.OBJECT;
			this.expect = PARSER_STATE.KEY1;
			break;

		case '[':
			yield {name: 'startArray'};

			this.stack.push(this.parent);
			this.parent = PARSER_STATE.ARRAY;
			this.expect = PARSER_STATE.VALUE1;
			break;

		case ']':
			if (this.expect !== PARSER_STATE.VALUE1) {
				throw new Error("Parser cannot parse input: unexpected token ']'");
			}

			if (this.openNumber) {
				yield {name: 'endNumber'};
				yield {name: 'numberValue', value: this.accumulator};

				this.openNumber = false;
				this.accumulator = '';
			}

			yield {name: 'endArray'};

			this.parent = <PARENT_STATE>this.stack.pop();
			this.expect = PARSER_EXPECTED[this.parent];
			break;

		case '-':
			this.openNumber = true;

			yield {name: 'startNumber'};
			yield {name: 'numberChunk', value: '-'};

			this.accumulator = '-';
			this.expect = PARSER_STATE.NUMBER_START;
			break;

		case '0':
			this.openNumber = true;

			yield {name: 'startNumber'};
			yield {name: 'numberChunk', value: '0'};

			this.accumulator = '0';
			this.expect = PARSER_STATE.NUMBER_FRACTION;
			break;

		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			this.openNumber = true;

			yield {name: 'startNumber'};
			yield {name: 'numberChunk', value: this.value};

			this.accumulator = this.value;
			this.expect = PARSER_STATE.NUMBER_DIGIT;
			break;

		case 'true':
		case 'false':
		case 'null':
			if (this.buffer.length - this.index === this.value.length) {
				return PARSER_DONE;
			}

			yield {name: `${this.value}Value`, value: PARSER_VALUES[this.value]};
			this.expect = PARSER_EXPECTED[this.parent];
			break;
	}

	this.index += this.value.length;
}

PARSER_STATES[PARSER_STATE.VALUE] = value;
PARSER_STATES[PARSER_STATE.VALUE1] = value;
