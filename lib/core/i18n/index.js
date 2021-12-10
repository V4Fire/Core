"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _i18n = require("../../core/prelude/i18n");

Object.keys(_i18n).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _i18n[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _i18n[key];
    }
  });
});