"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  syncSessionStorage: true,
  asyncSessionStorage: true
};
exports.asyncSessionStorage = void 0;
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _engine.default;
  }
});
exports.syncSessionStorage = void 0;
var _engine = _interopRequireDefault(require("../../../../core/kv-storage/engines/string/engine"));
var _interface = require("../../../../core/kv-storage/engines/string/interface");
Object.keys(_interface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface[key];
    }
  });
});
const syncSessionStorage = new _engine.default(),
  asyncSessionStorage = syncSessionStorage;
exports.asyncSessionStorage = asyncSessionStorage;
exports.syncSessionStorage = syncSessionStorage;