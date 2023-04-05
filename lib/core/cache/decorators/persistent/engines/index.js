"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _lazy = _interopRequireDefault(require("../../../../../core/cache/decorators/persistent/engines/lazy"));
var _lazyOffline = _interopRequireDefault(require("../../../../../core/cache/decorators/persistent/engines/lazy-offline"));
var _active = _interopRequireDefault(require("../../../../../core/cache/decorators/persistent/engines/active"));
var _interface = require("../../../../../core/cache/decorators/persistent/interface");
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
const engines = {
  onInit: _active.default,
  onDemand: _lazy.default,
  onOfflineDemand: _lazyOffline.default
};
var _default = engines;
exports.default = _default;