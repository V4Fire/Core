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
 * Parses the buffer for an object key and generates a token `startKey`.
 * Or if the object ended generates `endObject` token.
 *
 * @param this
 * @throws {@link SyntaxError}
 */
export function* key(this: Parser): Generator<Token> {
	this.patterns.key1.lastIndex = this.index;
	this.matched = this.patterns.key1.exec(this.buffer);

	if (this.matched == null) {
		if (this.index < this.buffer.length) {
			throw new SyntaxError("Can't parse the input: expected an object key");
		}

		return PARSING_COMPLETE;
	}

	this.value = this.matched[0];

	if (this.value === '"') {
		yield {name: 'startKey'};
		this.expected = parserStateTypes.KEY_VAL;

	} else if (this.value === '}') {
		if (this.expected !== parserStateTypes.KEY1) {
			throw new SyntaxError("Can't parse the input: unexpected token '}'");
		}

		yield {name: 'endObject'};
		this.parent = <ParentParserState>this.stack.pop();
		this.expected = parserExpected[this.parent];
	}

	this.index += this.value.length;
}

parserStates[parserStateTypes.KEY] = key;
parserStates[parserStateTypes.KEY1] = key;
