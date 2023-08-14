"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncSessionStorage = void 0;
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _engine.default;
  }
});
exports.syncSessionStorage = void 0;
var _engine = _interopRequireDefault(require("../../../../core/kv-storage/engines/string/engine"));
const syncSessionStorage = new _engine.default(),
  asyncSessionStorage = syncSessionStorage;
exports.asyncSessionStorage = asyncSessionStorage;
exports.syncSessionStorage = syncSessionStorage;