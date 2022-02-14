/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Parser from 'core/json/stream/parser';

import {

	parserStates,
	parserStateTypes,
	parserCharCodes,
	parserExpected,

	PARSING_COMPLETE

} from 'core/json/stream/const';

import { fromHex } from 'core/json/stream/parser/helpers';
import type { JsonToken } from 'core/json/stream/interface';

/**
 * Parses the buffer for the end of a key or string and generates a sequence of tokens
 * `endKey`, `keyValue` for a key or `endString`, `stringValue` and `stringChunk` for a string
 */
export function* string(this: Parser): Generator<JsonToken> {
	this.patterns.string.lastIndex = this.index;
	this.matched = this.patterns.string.exec(this.buffer);

	if (this.matched == null) {
		if (this.index < this.buffer.length && (this.buffer.length - this.index >= 6)) {
			throw new SyntaxError("Can't parse the input: escaped characters");
		}

		return PARSING_COMPLETE;
	}

	this.value = this.matched[0];

	if (this.value === '"') {
		if (this.expected === parserStateTypes.KEY_VAL) {
			yield {name: 'endKey'};
			yield {name: 'keyValue', value: this.accumulator};

			this.accumulator = '';
			this.expected = parserStateTypes.COLON;

		} else {
			yield {name: 'endString'};
			yield {name: 'stringValue', value: this.accumulator};

			this.accumulator = '';
			this.expected = parserExpected[this.parent];
		}

	} else if (this.value.length > 1 && this.value.startsWith('\\')) {
		const
			t = this.value.length === 2 ? parserCharCodes[this.value.charAt(1)] : fromHex(this.value);

		yield {
			name: 'stringChunk',
			value: t
		};

		this.accumulator += t;

	} else {
		yield {
			name: 'stringChunk',
			value: this.value
		};

		this.accumulator += this.value;
	}

	this.index += this.value.length;
}

parserStates[parserStateTypes.STRING] = string;
parserStates[parserStateTypes.KEY_VAL] = string;
