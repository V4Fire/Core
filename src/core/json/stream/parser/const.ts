/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export const
	MAX_PATTERN_SIZE = 16,
	PARSING_COMPLETE = Symbol('Parser final step');

export const
	parserStates = {};

const
	numberStart = /\d/y,
	numberDigit = /\d{0,256}/y;

export const parserPatterns = {
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

export const parserStateTypes = {
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
	NUMBER_FRACTION_START: 'numberFracStart',
	NUMBER_FRACTION_DIGIT: 'numberFracDigit',
	NUMBER_EXPONENT: 'numberExponent',
	NUMBER_DIGIT: 'numberDigit',
	NUMBER_EXP_SIGN: 'numberExpSign',
	NUMBER_EXP_START: 'numberExpStart',
	NUMBER_EXP_DIGIT: 'numberExpDigit',
	EMPTY: '',
	DONE: 'done'
} as const;

export const parserExpected = {
	[parserStateTypes.OBJECT]: parserStateTypes.OBJECT_STOP,
	[parserStateTypes.ARRAY]: parserStateTypes.ARRAY_STOP,
	[parserStateTypes.EMPTY]: parserStateTypes.DONE
};

export const parserCharCodes = {
	b: '\b',
	f: '\f',
	n: '\n',
	r: '\r',
	t: '\t',
	'"': '"',
	'\\': '\\',
	'/': '/'
};
