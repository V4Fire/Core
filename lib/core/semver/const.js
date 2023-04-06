"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.operations = exports.operandLengthErrorText = exports.compareRgxp = void 0;
const operations = {
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '==': (a, b) => a === b,
  '~=': (a, b) => a === b,
  '^=': (a, b) => a === b
};
exports.operations = operations;
const compareRgxp = /^(\^|~|)=/;
exports.compareRgxp = compareRgxp;
const operandLengthErrorText = 'Can\'t compare versions. The operand has an empty value.';
exports.operandLengthErrorText = operandLengthErrorText;