"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _revivers = require("../../core/json/revivers");
Object.keys(_revivers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _revivers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _revivers[key];
    }
  });
});
var _convert = require("../../core/json/convert");
Object.keys(_convert).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _convert[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _convert[key];
    }
  });
});