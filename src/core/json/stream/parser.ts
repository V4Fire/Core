/* eslint-disable max-lines-per-function */
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

const numberStart = /\d/y;
const numberDigit = /\d{0,256}/y;

const patterns = {
  value1: /["{[\]\-\d]|true\b|false\b|null\b|\s{1,256}/y,
  string: /[^"\\]{1,256}|\\[bfnrt"\\/]|\\u[\da-fA-F]{4}|"/y,
  key1: /["}]|\s{1,256}/y,
  colon: /:|\s{1,256}/y,
  comma: /[,\]}]|\s{1,256}/y,
	ws: /\s{1,256}/y,
	numberStart,
	numberFracStart: numberStart,
	numberExpStart: numberStart,
	numberDigit,
	numberFracDigit: numberDigit,
	numberExpDigit: numberDigit,
	numberFraction: /[.eE]/y,
	numberExponent: /[eE]/y,
	numberExpSign: /[-+]/y
};

const MAX_PATTERN_SIZE = 16;

// Long hexadecimal codes: \uXXXX
const fromHex = (s) => String.fromCharCode(parseInt(s.slice(2), 16));

// Short codes: \b \f \n \r \t \" \\ \/
const codes = {b: '\b', f: '\f', n: '\n', r: '\r', t: '\t', '"': '"', '\\': '\\', '/': '/'};

export interface ParserOptions {
	packKeys?: boolean;
	packValues?: boolean;
	packStrings?: boolean;
	packNumbers?: boolean;
	streamKeys?: boolean;
	streamStrings?: boolean;
	streamNumbers?: boolean;
	streamValues?: boolean;
}

const PARSER_STATE = {
	VALUE: 'value',
	VALUE1: 'value1',
	STRING: 'string',
	OBJECT: 'object',
	KEY: 'key',
	KEY1: 'key1',
	ARRAY: 'array',
	KEY_VAL: 'keyVal',
	COLON: 'colon',
	OBJECT_STOP: 'objectStop',
	ARRAY_STOP: 'arrayStop',
	NUMBER_START: 'numberStart',
	NUMBER_FRACTION: 'numberFraction',
	NUMBER_FRAC_START: 'numberFracStart',
	NUMBER_FRAC_DIGIT: 'numberFracDigit',
	NUMBER_EXPONENT: 'numberExponent',
	NUMBER_DIGIT: 'numberDigit',
	NUMBER_EXP_SIGN: 'numberExpSign',
	NUMBER_EXP_START: 'numberExpStart',
	NUMBER_EXP_DIGIT: 'numberExpDigit',
	EMPTY: '',
	DONE: 'done'
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
type PARSER_STATE = typeof PARSER_STATE[keyof typeof PARSER_STATE];
type PARENT_STATE = typeof PARSER_STATE.OBJECT | typeof PARSER_STATE.ARRAY | typeof PARSER_STATE.EMPTY;

const
	values = {true: true, false: false, null: null},
	expected = {
		[PARSER_STATE.OBJECT]: PARSER_STATE.OBJECT_STOP,
		[PARSER_STATE.ARRAY]: PARSER_STATE.ARRAY_STOP,
		[PARSER_STATE.EMPTY]: PARSER_STATE.DONE
	};

export class Parser {
	private readonly _packKeys?: boolean = true;
	private readonly _packStrings?: boolean = true;
	private readonly _packNumbers?: boolean = true;
	private readonly _streamKeys?: boolean = true;
	private readonly _streamStrings?: boolean = true;
	private readonly _streamNumbers?: boolean = true;

	private _expect: PARSER_STATE = PARSER_STATE.VALUE;
	private readonly _stack: PARENT_STATE[] = [];
	private _parent: PARENT_STATE = PARSER_STATE.EMPTY;
	private _openNumber: boolean = false;
	private _accumulator: string = '';
	private _buffer: string = '';

	constructor(options: ParserOptions = {}) {
		if ('packValues' in options) {
			this._packKeys = options.packValues;
			this._packStrings = options.packValues;
			this._packNumbers = options.packValues;
		}

		if ('packKeys' in options) {
			this._packKeys = options.packKeys;
		}

		if ('packStrings' in options) {
			(this._packStrings = options.packStrings);
		}

		if ('packNumbers' in options) {
			this._packNumbers = options.packNumbers;
		}

		if ('streamValues' in options) {
			this._streamKeys = options.streamValues;
			this._streamStrings = options.streamValues;
			this._streamNumbers = options.streamValues;
		}

		if ('streamKeys' in options) {
			this._streamKeys = options.streamKeys;
		}

		if ('streamStrings' in options) {
			this._streamStrings = options.streamStrings;
		}

		if ('streamNumbers' in options) {
			this._streamNumbers = options.streamNumbers;
		}

		if (!this._packKeys) {
			this._streamKeys = true;
		}

		if (!this._packStrings) {
			this._streamStrings = true;
		}

		if (!this._packNumbers) {
			this._streamNumbers = true;
		}
	}

	// eslint-disable-next-line complexity
	*processChunk(chunk: string): Generator<{name: string; value?: string | null | boolean}> {
		let
			match: RegExpExecArray | null,
			value: string | undefined = '',
			index = 0;

		this._buffer += chunk;

		main: for (; ;) {
			// eslint-disable-next-line default-case
			switch (this._expect) {
				case PARSER_STATE.VALUE1:
				case PARSER_STATE.VALUE:
					patterns.value1.lastIndex = index;
					match = patterns.value1.exec(this._buffer);

					if (!match) {
						if (index + MAX_PATTERN_SIZE < this._buffer.length) {
							if (index < this._buffer.length) {
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
							if (this._streamStrings) {
								yield {name: 'startString'};
							}

							this._expect = PARSER_STATE.STRING;
							break;

						case '{':
							yield {name: 'startObject'};
							this._stack.push(this._parent);
							this._parent = PARSER_STATE.OBJECT;
							this._expect = PARSER_STATE.KEY1;
							break;

						case '[':
							yield {name: 'startArray'};
							this._stack.push(this._parent);
							this._parent = PARSER_STATE.ARRAY;
							this._expect = PARSER_STATE.VALUE1;
							break;

						case ']':
							if (this._expect !== PARSER_STATE.VALUE1) {
								throw new Error("Parser cannot parse input: unexpected token ']'");
							}

							if (this._openNumber) {
								if (this._streamNumbers) {
									yield {name: 'endNumber'};
								}

								this._openNumber = false;

								if (this._packNumbers) {
									yield {name: 'numberValue', value: this._accumulator};
									this._accumulator = '';
								}
							}

							yield {name: 'endArray'};
							this._parent = <PARENT_STATE>this._stack.pop();
							this._expect = expected[this._parent];
							break;

						case '-':
							this._openNumber = true;

							if (this._streamNumbers) {
								yield {name: 'startNumber'};
								yield {name: 'numberChunk', value: '-'};
							}

							this._packNumbers && (this._accumulator = '-');
							this._expect = PARSER_STATE.NUMBER_START;
							break;

						case '0':
							this._openNumber = true;

							if (this._streamNumbers) {
								yield {name: 'startNumber'};
								yield {name: 'numberChunk', value: '0'};
							}

							this._packNumbers && (this._accumulator = '0');
							this._expect = PARSER_STATE.NUMBER_FRACTION;
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
							this._openNumber = true;

							if (this._streamNumbers) {
								yield {name: 'startNumber'};
								yield {name: 'numberChunk', value};
							}

							this._packNumbers && (this._accumulator = value);
							this._expect = PARSER_STATE.NUMBER_DIGIT;
							break;

						case 'true':
						case 'false':
						case 'null':
							if (this._buffer.length - index === value.length) {
								break main;
							}

							yield {name: `${value}Value`, value: values[value]};
							this._expect = expected[this._parent];
							break;
					}

					index += value.length;
					break;

				case PARSER_STATE.KEY_VAL:
				case PARSER_STATE.STRING:
					patterns.string.lastIndex = index;
					match = patterns.string.exec(this._buffer);

					if (!match) {
						if (index < this._buffer.length && (this._buffer.length - index >= 6)) {
							throw new Error('Parser cannot parse input: escaped characters');
						}

						break main;
					}

					value = match[0];

					if (value === '"') {
						if (this._expect === PARSER_STATE.KEY_VAL) {
							if (this._streamKeys) {
								yield {name: 'endKey'};
							}

							if (this._packKeys) {
								yield {name: 'keyValue', value: this._accumulator};
								this._accumulator = '';
							}

							this._expect = PARSER_STATE.COLON;

						} else {
							if (this._streamStrings) {
								yield {name: 'endString'};
							}

							if (this._packStrings) {
								yield {name: 'stringValue', value: this._accumulator};
								this._accumulator = '';
							}

							this._expect = expected[this._parent];
						}

					} else if (value.length > 1 && value.startsWith('\\')) {
						const t = value.length === 2 ? codes[value.charAt(1)] : fromHex(value);

						if (this._expect === PARSER_STATE.KEY_VAL ? this._streamKeys : this._streamStrings) {
							yield {name: 'stringChunk', value: t};
						}

						if (this._expect === PARSER_STATE.KEY_VAL ? this._packKeys : this._packStrings) {
							this._accumulator += t;
						}

					} else {
						if (this._expect === PARSER_STATE.KEY_VAL ? this._streamKeys : this._streamStrings) {
							yield {name: 'stringChunk', value};
						}

						if (this._expect === PARSER_STATE.KEY_VAL ? this._packKeys : this._packStrings) {
							this._accumulator += value;
						}
					}

					index += value.length;
					break;

				case PARSER_STATE.KEY1:
				case 'key':
					patterns.key1.lastIndex = index;
					match = patterns.key1.exec(this._buffer);

					if (!match) {
						if (index < this._buffer.length) {
							throw new Error('Parser cannot parse input: expected an object key');
						}

						break main;
					}

					value = match[0];

					if (value === '"') {
						if (this._streamKeys) {
							yield {name: 'startKey'};
						}

						this._expect = PARSER_STATE.KEY_VAL;

					} else if (value === '}') {
						if (this._expect !== PARSER_STATE.KEY1) {
							throw new Error("Parser cannot parse input: unexpected token '}'");
						}

						yield {name: 'endObject'};
						this._parent = <PARENT_STATE>this._stack.pop();
						this._expect = expected[this._parent];
					}

					index += value.length;
					break;

				case PARSER_STATE.COLON:
					patterns.colon.lastIndex = index;
					match = patterns.colon.exec(this._buffer);

					if (!match) {
						if (index < this._buffer.length) {
							throw new Error("Parser cannot parse input: expected ':'");
						}

						break main;
					}

					value = match[0];
					value === ':' && (this._expect = PARSER_STATE.VALUE);

					index += value.length;
					break;

				case PARSER_STATE.ARRAY_STOP:
				case PARSER_STATE.OBJECT_STOP:
					patterns.comma.lastIndex = index;
					match = patterns.comma.exec(this._buffer);

					if (!match) {
						if (index < this._buffer.length) {
							throw new Error("Parser cannot parse input: expected ','");
						}

						break main;
					}

					if (this._openNumber) {
						if (this._streamNumbers) {
							yield {name: 'endNumber'};
						}

						this._openNumber = false;

						if (this._packNumbers) {
							yield {name: 'numberValue', value: this._accumulator};
							this._accumulator = '';
						}
					}

					value = match[0];

					if (value === ',') {
						this._expect = this._expect === PARSER_STATE.ARRAY_STOP ? PARSER_STATE.VALUE : 'key';

					} else if (value === '}' || value === ']') {
						yield {name: value === '}' ? 'endObject' : 'endArray'};
						this._parent = <PARENT_STATE>this._stack.pop();
						this._expect = expected[this._parent];
					}

					index += value.length;
					break;

				// Number chunks]
				// [0-9]
				case PARSER_STATE.NUMBER_START:
					patterns.numberStart.lastIndex = index;
					match = patterns.numberStart.exec(this._buffer);

					if (!match) {
						if (index < this._buffer.length) {
							throw new Error('Parser cannot parse input: expected a starting digit');
						}

						break main;
					}

					value = match[0];

					if (this._streamNumbers) {
						yield {name: 'numberChunk', value};
					}

					this._packNumbers && (this._accumulator += value);
					this._expect = value === '0' ? PARSER_STATE.NUMBER_FRACTION : PARSER_STATE.NUMBER_DIGIT;

					index += value.length;
					break;

				// [0-9]*
				case PARSER_STATE.NUMBER_DIGIT:
					patterns.numberDigit.lastIndex = index;
					match = patterns.numberDigit.exec(this._buffer);

					if (!match) {
						if (index < this._buffer.length) {
							throw new Error('Parser cannot parse input: expected a digit');
						}

						break main;
					}

					value = match[0];

					if (value.length > 0) {
						if (this._streamNumbers) {
							yield {name: 'numberChunk', value};
						}

						this._packNumbers && (this._accumulator += value);

						index += value.length;

					} else {
						if (index < this._buffer.length) {
							this._expect = PARSER_STATE.NUMBER_FRACTION;
							break;
						}

						break main;
					}

					break;

				// [\.eE]?
				case PARSER_STATE.NUMBER_FRACTION:
					patterns.numberFraction.lastIndex = index;
					match = patterns.numberFraction.exec(this._buffer);

					if (!match) {
						if (index < this._buffer.length) {
							this._expect = expected[this._parent];
							break;
						}

						break main;
					}

					value = match[0];

					if (this._streamNumbers) {
						yield {name: 'numberChunk', value};
					}

					this._packNumbers && (this._accumulator += value);
					this._expect = value === '.' ? PARSER_STATE.NUMBER_FRAC_START : PARSER_STATE.NUMBER_EXP_SIGN;

					index += value.length;
					break;

				// [0-9]
				case PARSER_STATE.NUMBER_FRAC_START:
					patterns.numberFracStart.lastIndex = index;
					match = patterns.numberFracStart.exec(this._buffer);

					if (!match) {
						if (index < this._buffer.length) {
							throw new Error('Parser cannot parse input: expected a fractional part of a number');
						}

						break main;
					}

					value = match[0];

					if (this._streamNumbers) {
						yield {name: 'numberChunk', value};
					}

					this._packNumbers && (this._accumulator += value);
					this._expect = PARSER_STATE.NUMBER_FRAC_DIGIT;

					index += value.length;
					break;

				// [0-9]*
				case PARSER_STATE.NUMBER_FRAC_DIGIT:
					patterns.numberFracDigit.lastIndex = index;
					match = patterns.numberFracDigit.exec(this._buffer);
					value = match?.[0];

					if (value != null) {
						if (this._streamNumbers) {
							yield {name: 'numberChunk', value};
						}

						this._packNumbers && (this._accumulator += value);

						index += value.length;

					} else {
						if (index < this._buffer.length) {
							this._expect = PARSER_STATE.NUMBER_EXPONENT;
							break;
						}

						break main;
					}

					break;

				// [eE]?
				case PARSER_STATE.NUMBER_EXPONENT:
					patterns.numberExponent.lastIndex = index;
					match = patterns.numberExponent.exec(this._buffer);

					if (!match) {
						if (index < this._buffer.length) {
							this._expect = expected[this._parent];
							break;
						}

						break main;
					}

					value = match[0];

					if (this._streamNumbers) {
						yield {name: 'numberChunk', value};
					}

					this._packNumbers && (this._accumulator += value);
					this._expect = PARSER_STATE.NUMBER_EXP_SIGN;

					index += value.length;
					break;

				// [-+]?
				case PARSER_STATE.NUMBER_EXP_SIGN:
					patterns.numberExpSign.lastIndex = index;
					match = patterns.numberExpSign.exec(this._buffer);

					if (!match) {
						if (index < this._buffer.length) {
							this._expect = PARSER_STATE.NUMBER_EXP_START;
							break;
						}

						break main;
					}

					value = match[0];

					if (this._streamNumbers) {
						yield {name: 'numberChunk', value};
					}

					this._packNumbers && (this._accumulator += value);
					this._expect = PARSER_STATE.NUMBER_EXP_START;

					index += value.length;
					break;

				// [0-9]
				case PARSER_STATE.NUMBER_EXP_START:
					patterns.numberExpStart.lastIndex = index;
					match = patterns.numberExpStart.exec(this._buffer);

					if (!match) {
						if (index < this._buffer.length) {
							throw new Error('Parser cannot parse input: expected an exponent part of a number');
						}

						break main;
					}

					value = match[0];

					if (this._streamNumbers) {
						yield {name: 'numberChunk', value};
					}

					this._packNumbers && (this._accumulator += value);
					this._expect = PARSER_STATE.NUMBER_EXP_DIGIT;

					index += value.length;
					break;

				// [0-9]*
				case PARSER_STATE.NUMBER_EXP_DIGIT:
					patterns.numberExpDigit.lastIndex = index;
					match = patterns.numberExpDigit.exec(this._buffer);
					value = match?.[0];

					if (value != null) {
						if (this._streamNumbers) {
							yield {name: 'numberChunk', value};
						}

						this._packNumbers && (this._accumulator += value);

						index += value.length;

					} else {
						if (index < this._buffer.length) {
							this._expect = expected[this._parent];
							break;
						}

						break main;
					}

					break;

				case PARSER_STATE.DONE:
					patterns.ws.lastIndex = index;
					match = patterns.ws.exec(this._buffer);

					if (!match) {
						if (index < this._buffer.length) {

							throw new Error('Parser cannot parse input: unexpected characters');
						}

						break main;
					}

					value = match[0];

					if (this._openNumber) {
						if (this._streamNumbers) {
							yield {name: 'endNumber'};
						}

						this._openNumber = false;

						if (this._packNumbers) {
							yield {name: 'numberValue', value: this._accumulator};
							this._accumulator = '';
						}
					}

					index += value.length;
					break;
			}
		}

		this._buffer = this._buffer.slice(index);
	}
}
