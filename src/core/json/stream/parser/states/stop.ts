/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Parser from 'core/json/stream/parser';

import { parserStates, parserStateTypes, parserExpected, PARSING_COMPLETE } from 'core/json/stream/parser/const';
import type { Token, ParentParserState } from 'core/json/stream/parser/interface';

/**
 * Parses the buffer for the end of the current structure (an object or array) and
 * generates tokens `endObject` or `endArray`
 *
 * @param this
 * @throws {@link SyntaxError}
 */
export function* stop(this: Parser): Generator<Token> {
	this.patterns.comma.lastIndex = this.index;
	this.matched = this.patterns.comma.exec(this.buffer);

	if (this.matched == null) {
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

	this.value = this.matched[0];

	if (this.value === ',') {
		this.expected = this.expected === parserStateTypes.ARRAY_STOP ? parserStateTypes.VALUE : 'key';

	} else if (this.value === '}' || this.value === ']') {
		yield {name: this.value === '}' ? 'endObject' : 'endArray'};
		this.parent = <ParentParserState>this.stack.pop();
		this.expected = parserExpected[this.parent];
	}

	this.index += this.value.length;
}

parserStates[parserStateTypes.ARRAY_STOP] = stop;
parserStates[parserStateTypes.OBJECT_STOP] = stop;
