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
	parserExpected,

	MAX_PATTERN_SIZE,
	PARSING_COMPLETE

} from 'core/json/stream/parser/const';

import type { Token, ParentParserState } from 'core/json/stream/parser/interface';

/**
 * Parses the buffer for a value, generates a sequence of tokens, and sets the next expected value
 */
export function* value(this: Parser): Generator<Token> {
	this.patterns.value1.lastIndex = this.index;
	this.matched = this.patterns.value1.exec(this.buffer);

	if (this.matched == null) {
		if (this.index + MAX_PATTERN_SIZE < this.buffer.length) {
			if (this.index < this.buffer.length) {
				throw new SyntaxError("Can't parse the input: expected a value");
			}

			throw new SyntaxError('The parser has expected a value');
		}

		return PARSING_COMPLETE;
	}

	this.value = this.matched[0];

	switch (this.value) {
		case '"':
			yield {name: 'startString'};

			this.expected = parserStateTypes.STRING;
			break;

		case '{':
			yield {name: 'startObject'};

			this.stack.push(this.parent);
			this.parent = parserStateTypes.OBJECT;
			this.expected = parserStateTypes.KEY1;

			break;

		case '[':
			yield {name: 'startArray'};

			this.stack.push(this.parent);
			this.parent = parserStateTypes.ARRAY;
			this.expected = parserStateTypes.VALUE1;

			break;

		case ']':
			if (this.expected !== parserStateTypes.VALUE1) {
				throw new SyntaxError("Parser cannot parse input: unexpected token ']'");
			}

			if (this.isOpenNumber) {
				yield {name: 'endNumber'};
				yield {name: 'numberValue', value: this.accumulator};

				this.isOpenNumber = false;
				this.accumulator = '';
			}

			yield {name: 'endArray'};

			this.parent = <ParentParserState>this.stack.pop();
			this.expected = parserExpected[this.parent];

			break;

		case '-':
			this.isOpenNumber = true;

			yield {name: 'startNumber'};
			yield {name: 'numberChunk', value: '-'};

			this.accumulator = '-';
			this.expected = parserStateTypes.NUMBER_START;

			break;

		case '0':
			this.isOpenNumber = true;

			yield {name: 'startNumber'};
			yield {name: 'numberChunk', value: '0'};

			this.accumulator = '0';
			this.expected = parserStateTypes.NUMBER_FRACTION;

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
			this.isOpenNumber = true;

			yield {name: 'startNumber'};
			yield {name: 'numberChunk', value: this.value};

			this.accumulator = this.value;
			this.expected = parserStateTypes.NUMBER_DIGIT;

			break;

		case 'true':
		case 'false':
		case 'null':
			yield {
				name: `${this.value}Value`,
				value: Object.parse(this.value)
			};

			if (this.buffer.length - this.index === this.value.length) {
				return PARSING_COMPLETE;
			}

			this.expected = parserExpected[this.parent];
			break;

		default:
			// Do nothing;
	}

	this.index += this.value.length;
}

parserStates[parserStateTypes.VALUE] = value;
parserStates[parserStateTypes.VALUE1] = value;
