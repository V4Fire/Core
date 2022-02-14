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
 * Parses the buffer for an object key and generates a token `startKey`.
 * Or if the object ended generates `endObject` token.
 */
export function* key(this: Parser): Generator<JsonToken> {
	this.patterns.key1.lastIndex = this.index;
	this.match = this.patterns.key1.exec(this.buffer);

	if (this.match == null) {
		if (this.index < this.buffer.length) {
			throw new SyntaxError("Can't parse the input: expected an object key");
		}

		return PARSING_COMPLETE;
	}

	this.value = this.match[0];

	if (this.value === '"') {
		yield {name: 'startKey'};
		this.expect = parserStateTypes.KEY_VAL;

	} else if (this.value === '}') {
		if (this.expect !== parserStateTypes.KEY1) {
			throw new SyntaxError("Can't parse the input: unexpected token '}'");
		}

		yield {name: 'endObject'};
		this.parent = <ParentParserState>this.stack.pop();
		this.expect = parserExpected[this.parent];
	}

	this.index += this.value.length;
}

parserStates[parserStateTypes.KEY] = key;
parserStates[parserStateTypes.KEY1] = key;
