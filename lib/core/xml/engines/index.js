"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serialize = void 0;
var _env = require("../../../core/env");
let serialize;
exports.serialize = serialize;
if (_env.IS_NODE) {
  ({
    serialize
  } = require('../../../core/xml/engines/node'));
  exports.serialize = serialize;
} else {
  ({
    serialize
  } = require('../../../core/xml/engines/browser'));
  exports.serialize = serialize;
}