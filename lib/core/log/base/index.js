"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  extend: true,
  cmpLevels: true,
  DEFAULT_LEVEL: true
};
Object.defineProperty(exports, "DEFAULT_LEVEL", {
  enumerable: true,
  get: function () {
    return _level.DEFAULT_LEVEL;
  }
});
Object.defineProperty(exports, "cmpLevels", {
  enumerable: true,
  get: function () {
    return _level.cmpLevels;
  }
});
Object.defineProperty(exports, "extend", {
  enumerable: true,
  get: function () {
    return _extend.default;
  }
});
var _extend = _interopRequireDefault(require("../../../core/log/base/extend"));
var _level = require("../../../core/log/base/level");
var _interface = require("../../../core/log/base/interface");
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