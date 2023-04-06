"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toOriginalObject = exports.SELF = exports.NULL = void 0;
var _const = require("../../../core/prelude/types/const");
const SELF = {},
  NULL = {};
exports.NULL = NULL;
exports.SELF = SELF;
const toOriginalObject = _const.PROXY;
exports.toOriginalObject = toOriginalObject;