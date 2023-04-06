"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  SyncPromise: true
};
Object.defineProperty(exports, "SyncPromise", {
  enumerable: true,
  get: function () {
    return _syncPromise.default;
  }
});
var _helpers = require("../../../core/prelude/structures/helpers");
Object.keys(_helpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _helpers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _helpers[key];
    }
  });
});
var _syncPromise = _interopRequireDefault(require("../../../core/prelude/structures/sync-promise"));