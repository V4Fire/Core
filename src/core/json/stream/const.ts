/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

const numberStart = /\d/y;
const numberDigit = /\d{0,256}/y;

export const patterns = {
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

export const MAX_PATTERN_SIZE = 16;

export const PARSER_STATE = {
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

// Short codes: \b \f \n \r \t \" \\ \/
export const codes = {b: '\b', f: '\f', n: '\n', r: '\r', t: '\t', '"': '"', '\\': '\\', '/': '/'};
