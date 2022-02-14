/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Parser from 'core/json/stream/parser';

import { parserStates, parserStateTypes, parserExpected, PARSING_COMPLETE } from 'core/json/stream/const';
import type { JsonToken, ParentParserState } from 'core/json/stream/interface';

/**
 * Parses the buffer for the end of the current structure (an object or array) and
 * generates tokens `endObject` or `endArray`
 */
export function* stop(this: Parser): Generator<JsonToken> {
	this.patterns.comma.lastIndex = this.index;
	this.match = this.patterns.comma.exec(this.buffer);

	if (this.match == null) {
		if (this.index < this.buffer.length) {
			throw new SyntaxError("Parser cannot parse input: expected ','");
		}

		return PARSING_COMPLETE;
	}

	if (this.isOpenNumber) {
		yield {name: 'endNumber'};
		this.isOpenNumber = false;

		yield {name: 'numberValue', value: this.accumulator};
		this.accumulator = '';
	}

	this.value = this.match[0];

	if (this.value === ',') {
		this.expect = this.expect === parserStateTypes.ARRAY_STOP ? parserStateTypes.VALUE : 'key';

	} else if (this.value === '}' || this.value === ']') {
		yield {name: this.value === '}' ? 'endObject' : 'endArray'};
		this.parent = <ParentParserState>this.stack.pop();
		this.expect = parserExpected[this.parent];
	}

	this.index += this.value.length;
}

parserStates[parserStateTypes.ARRAY_STOP] = stop;
parserStates[parserStateTypes.OBJECT_STOP] = stop;
