"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _kvStorage = require("../../../core/kv-storage");
const storage = _kvStorage.local.namespace('[[I18N]]');
var _default = storage;
exports.default = _default;