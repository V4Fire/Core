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
import { patterns, MAX_PATTERN_SIZE, PARSER_STATE, codes } from 'core/json/stream/const';
import type { TPARSER_STATE, PARENT_STATE, JsonToken } from 'core/json/stream/interface';
import { fromHex } from 'core/json/stream/helpers';

const
	values = {true: true, false: false, null: null},
	expected = {
		[PARSER_STATE.OBJECT]: PARSER_STATE.OBJECT_STOP,
		[PARSER_STATE.ARRAY]: PARSER_STATE.ARRAY_STOP,
		[PARSER_STATE.EMPTY]: PARSER_STATE.DONE
	};

export class Parser {
	protected expect: TPARSER_STATE = PARSER_STATE.VALUE;
	protected readonly stack: PARENT_STATE[] = [];
	protected parent: PARENT_STATE = PARSER_STATE.EMPTY;
	protected openNumber: boolean = false;
	protected accumulator: string = '';
	protected buffer: string = '';

	// eslint-disable-next-line complexity, max-lines-per-function
	*processChunk(chunk: string): Generator<JsonToken> {
		let
			match: RegExpExecArray | null,
			value: string | undefined = '',
			index = 0;

		this.buffer += chunk;

		main: for (; ;) {
			// eslint-disable-next-line default-case
			switch (this.expect) {
				case PARSER_STATE.VALUE1:
				case PARSER_STATE.VALUE:
					patterns.value1.lastIndex = index;
					match = patterns.value1.exec(this.buffer);

					if (!match) {
						if (index + MAX_PATTERN_SIZE < this.buffer.length) {
							if (index < this.buffer.length) {
								throw new Error('Parser cannot parse input: expected a value');
							}

							throw new Error('Parser has expected a value');
						}

						break main;
					}

					value = match[0];

					// eslint-disable-next-line default-case
					switch (value) {
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
							this.expect = expected[this.parent];
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
							yield {name: 'numberChunk', value};

							this.accumulator = value;
							this.expect = PARSER_STATE.NUMBER_DIGIT;
							break;

						case 'true':
						case 'false':
						case 'null':
							if (this.buffer.length - index === value.length) {
								break main;
							}

							yield {name: `${value}Value`, value: values[value]};
							this.expect = expected[this.parent];
							break;
					}

					index += value.length;
					break;

				case PARSER_STATE.KEY_VAL:
				case PARSER_STATE.STRING:
					patterns.string.lastIndex = index;
					match = patterns.string.exec(this.buffer);

					if (!match) {
						if (index < this.buffer.length && (this.buffer.length - index >= 6)) {
							throw new Error('Parser cannot parse input: escaped characters');
						}

						break main;
					}

					value = match[0];

					if (value === '"') {
						if (this.expect === PARSER_STATE.KEY_VAL) {
							yield {name: 'endKey'};
							yield {name: 'keyValue', value: this.accumulator};

							this.accumulator = '';
							this.expect = PARSER_STATE.COLON;

						} else {
							yield {name: 'endString'};
							yield {name: 'stringValue', value: this.accumulator};

							this.accumulator = '';
							this.expect = expected[this.parent];
						}

					} else if (value.length > 1 && value.startsWith('\\')) {
						const t = value.length === 2 ? codes[value.charAt(1)] : fromHex(value);
						yield {name: 'stringChunk', value: t};
						this.accumulator += t;

					} else {
						yield {name: 'stringChunk', value};

						this.accumulator += value;
					}

					index += value.length;
					break;

				case PARSER_STATE.KEY1:
				case 'key':
					patterns.key1.lastIndex = index;
					match = patterns.key1.exec(this.buffer);

					if (!match) {
						if (index < this.buffer.length) {
							throw new Error('Parser cannot parse input: expected an object key');
						}

						break main;
					}

					value = match[0];

					if (value === '"') {
						yield {name: 'startKey'};
						this.expect = PARSER_STATE.KEY_VAL;

					} else if (value === '}') {
						if (this.expect !== PARSER_STATE.KEY1) {
							throw new Error("Parser cannot parse input: unexpected token '}'");
						}

						yield {name: 'endObject'};
						this.parent = <PARENT_STATE>this.stack.pop();
						this.expect = expected[this.parent];
					}

					index += value.length;
					break;

				case PARSER_STATE.COLON:
					patterns.colon.lastIndex = index;
					match = patterns.colon.exec(this.buffer);

					if (!match) {
						if (index < this.buffer.length) {
							throw new Error("Parser cannot parse input: expected ':'");
						}

						break main;
					}

					value = match[0];
					value === ':' && (this.expect = PARSER_STATE.VALUE);

					index += value.length;
					break;

				case PARSER_STATE.ARRAY_STOP:
				case PARSER_STATE.OBJECT_STOP:
					patterns.comma.lastIndex = index;
					match = patterns.comma.exec(this.buffer);

					if (!match) {
						if (index < this.buffer.length) {
							throw new Error("Parser cannot parse input: expected ','");
						}

						break main;
					}

					if (this.openNumber) {
						yield {name: 'endNumber'};
						this.openNumber = false;

						yield {name: 'numberValue', value: this.accumulator};
						this.accumulator = '';
					}

					value = match[0];

					if (value === ',') {
						this.expect = this.expect === PARSER_STATE.ARRAY_STOP ? PARSER_STATE.VALUE : 'key';

					} else if (value === '}' || value === ']') {
						yield {name: value === '}' ? 'endObject' : 'endArray'};
						this.parent = <PARENT_STATE>this.stack.pop();
						this.expect = expected[this.parent];
					}

					index += value.length;
					break;

				// Number chunks]
				// [0-9]
				case PARSER_STATE.NUMBER_START:
					patterns.numberStart.lastIndex = index;
					match = patterns.numberStart.exec(this.buffer);

					if (!match) {
						if (index < this.buffer.length) {
							throw new Error('Parser cannot parse input: expected a starting digit');
						}

						break main;
					}

					value = match[0];

					yield {name: 'numberChunk', value};

					this.accumulator += value;
					this.expect = value === '0' ? PARSER_STATE.NUMBER_FRACTION : PARSER_STATE.NUMBER_DIGIT;

					index += value.length;
					break;

				// [0-9]*
				case PARSER_STATE.NUMBER_DIGIT:
					patterns.numberDigit.lastIndex = index;
					match = patterns.numberDigit.exec(this.buffer);

					if (!match) {
						if (index < this.buffer.length) {
							throw new Error('Parser cannot parse input: expected a digit');
						}

						break main;
					}

					value = match[0];

					if (value.length > 0) {
						yield {name: 'numberChunk', value};

						this.accumulator += value;

						index += value.length;

					} else {
						if (index < this.buffer.length) {
							this.expect = PARSER_STATE.NUMBER_FRACTION;
							break;
						}

						break main;
					}

					break;

				// [\.eE]?
				case PARSER_STATE.NUMBER_FRACTION:
					patterns.numberFraction.lastIndex = index;
					match = patterns.numberFraction.exec(this.buffer);

					if (!match) {
						if (index < this.buffer.length) {
							this.expect = expected[this.parent];
							break;
						}

						break main;
					}

					value = match[0];

					yield {name: 'numberChunk', value};

					this.accumulator += value;
					this.expect = value === '.' ? PARSER_STATE.NUMBER_FRAC_START : PARSER_STATE.NUMBER_EXP_SIGN;

					index += value.length;
					break;

				// [0-9]
				case PARSER_STATE.NUMBER_FRAC_START:
					patterns.numberFracStart.lastIndex = index;
					match = patterns.numberFracStart.exec(this.buffer);

					if (!match) {
						if (index < this.buffer.length) {
							throw new Error('Parser cannot parse input: expected a fractional part of a number');
						}

						break main;
					}

					value = match[0];

					yield {name: 'numberChunk', value};

					this.accumulator += value;
					this.expect = PARSER_STATE.NUMBER_FRAC_DIGIT;

					index += value.length;
					break;

				// [0-9]*
				case PARSER_STATE.NUMBER_FRAC_DIGIT:
					patterns.numberFracDigit.lastIndex = index;
					match = patterns.numberFracDigit.exec(this.buffer);
					value = match?.[0];

					if (value != null) {
						yield {name: 'numberChunk', value};

						this.accumulator += value;

						index += value.length;

					} else {
						if (index < this.buffer.length) {
							this.expect = PARSER_STATE.NUMBER_EXPONENT;
							break;
						}

						break main;
					}

					break;

				// [eE]?
				case PARSER_STATE.NUMBER_EXPONENT:
					patterns.numberExponent.lastIndex = index;
					match = patterns.numberExponent.exec(this.buffer);

					if (!match) {
						if (index < this.buffer.length) {
							this.expect = expected[this.parent];
							break;
						}

						break main;
					}

					value = match[0];

					yield {name: 'numberChunk', value};

					this.accumulator += value;
					this.expect = PARSER_STATE.NUMBER_EXP_SIGN;

					index += value.length;
					break;

				// [-+]?
				case PARSER_STATE.NUMBER_EXP_SIGN:
					patterns.numberExpSign.lastIndex = index;
					match = patterns.numberExpSign.exec(this.buffer);

					if (!match) {
						if (index < this.buffer.length) {
							this.expect = PARSER_STATE.NUMBER_EXP_START;
							break;
						}

						break main;
					}

					value = match[0];

					yield {name: 'numberChunk', value};

					this.accumulator += value;
					this.expect = PARSER_STATE.NUMBER_EXP_START;

					index += value.length;
					break;

				// [0-9]
				case PARSER_STATE.NUMBER_EXP_START:
					patterns.numberExpStart.lastIndex = index;
					match = patterns.numberExpStart.exec(this.buffer);

					if (!match) {
						if (index < this.buffer.length) {
							throw new Error('Parser cannot parse input: expected an exponent part of a number');
						}

						break main;
					}

					value = match[0];

					yield {name: 'numberChunk', value};

					this.accumulator += value;
					this.expect = PARSER_STATE.NUMBER_EXP_DIGIT;

					index += value.length;
					break;

				// [0-9]*
				case PARSER_STATE.NUMBER_EXP_DIGIT:
					patterns.numberExpDigit.lastIndex = index;
					match = patterns.numberExpDigit.exec(this.buffer);
					value = match?.[0];

					if (value != null) {
						yield {name: 'numberChunk', value};

						this.accumulator += value;

						index += value.length;

					} else {
						if (index < this.buffer.length) {
							this.expect = expected[this.parent];
							break;
						}

						break main;
					}

					break;

				case PARSER_STATE.DONE:
					patterns.ws.lastIndex = index;
					match = patterns.ws.exec(this.buffer);

					if (!match) {
						if (index < this.buffer.length) {

							throw new Error('Parser cannot parse input: unexpected characters');
						}

						break main;
					}

					value = match[0];

					if (this.openNumber) {
						yield {name: 'endNumber'};

						this.openNumber = false;

						yield {name: 'numberValue', value: this.accumulator};
						this.accumulator = '';
					}

					index += value.length;
					break;
			}
		}

		this.buffer = this.buffer.slice(index);
	}
}
