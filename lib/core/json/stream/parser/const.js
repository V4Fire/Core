"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parserStates = exports.parserStateTypes = exports.parserPatterns = exports.parserExpected = exports.parserCharCodes = exports.PARSING_COMPLETE = exports.MAX_PATTERN_SIZE = void 0;
const MAX_PATTERN_SIZE = 16,
  PARSING_COMPLETE = Symbol('Parser final step');
exports.PARSING_COMPLETE = PARSING_COMPLETE;
exports.MAX_PATTERN_SIZE = MAX_PATTERN_SIZE;
const parserStates = {};
exports.parserStates = parserStates;
const numberStart = /\d/y,
  numberDigit = /\d{0,256}/y;
const parserPatterns = {
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
exports.parserPatterns = parserPatterns;
const parserStateTypes = {
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
};
exports.parserStateTypes = parserStateTypes;
const parserExpected = {
  [parserStateTypes.OBJECT]: parserStateTypes.OBJECT_STOP,
  [parserStateTypes.ARRAY]: parserStateTypes.ARRAY_STOP,
  [parserStateTypes.EMPTY]: parserStateTypes.DONE
};
exports.parserExpected = parserExpected;
const parserCharCodes = {
  b: '\b',
  f: '\f',
  n: '\n',
  r: '\r',
  t: '\t',
  '"': '"',
  '\\': '\\',
  '/': '/'
};
exports.parserCharCodes = parserCharCodes;