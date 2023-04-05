"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _string = require("../../core/const/string");
Object.keys(_string).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _string[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _string[key];
    }
  });
});