"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expandedParse = expandedParse;
exports.expandedStringify = expandedStringify;
const typeRgxp = /^\[object (.*)]$/,
  isCustomSerialized = /^__DATA__:/;
function expandedStringify(_, value) {
  const type = typeRgxp.exec({}.toString.call(value))[1];
  switch (type) {
    case 'Date':
      return customSerialize(value.valueOf());
    case 'BigInt':
    case 'Function':
      return customSerialize(value.toString());
    case 'Map':
    case 'Set':
      return customSerialize([...value]);
  }
  return value;
  function customSerialize(value) {
    return {
      __DATA__: `__DATA__:${type}`,
      [`__DATA__:${type}`]: value
    };
  }
}
function expandedParse(key, value) {
  if (value != null && typeof value === 'object' && '__DATA__' in value) {
    return value[value['__DATA__']];
  }
  if (isCustomSerialized.test(key)) {
    const unsafeValue = value;
    switch (key.split(':')[1]) {
      case 'Date':
        return new Date(unsafeValue);
      case 'BigInt':
        return BigInt(unsafeValue);
      case 'Function':
        return Function(`return ${unsafeValue}`)();
      case 'Map':
        return new Map(unsafeValue);
      case 'Set':
        return new Set(unsafeValue);
    }
  }
  return value;
}