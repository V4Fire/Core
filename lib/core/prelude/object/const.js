"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInvalidKey = exports.funcCache = exports.canParse = void 0;
const canParse = /^[[{"]|^(?:true|false|null|(?:0\.)?\d+(?:[eE]\d+)?)$/;
exports.canParse = canParse;
const isInvalidKey = /^__proto__$/;
exports.isInvalidKey = isInvalidKey;
const funcCache = new WeakMap();
exports.funcCache = funcCache;