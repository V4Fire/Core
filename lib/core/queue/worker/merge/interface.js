"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _interface = require("../../../../core/queue/worker/interface");
Object.keys(_interface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _interface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface[key];
    }
  });
});
var _interface2 = require("../../../../core/queue/merge/interface");
Object.keys(_interface2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _interface2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface2[key];
    }
  });
});