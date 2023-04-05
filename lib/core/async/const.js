"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.namespaces = exports.linkNamesDictionary = void 0;
var _interface = require("../../core/async/interface");
const namespaces = Object.convertEnumToDict(_interface.Namespaces),
  linkNamesDictionary = namespaces;
exports.linkNamesDictionary = linkNamesDictionary;
exports.namespaces = namespaces;