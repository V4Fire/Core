"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _interface = require("../../core/async/core/interface");
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
var _interface2 = require("../../core/async/events/interface");
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
var _interface3 = require("../../core/async/proxy/interface");
Object.keys(_interface3).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _interface3[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface3[key];
    }
  });
});
var _interface4 = require("../../core/async/timers/interface");
Object.keys(_interface4).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _interface4[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface4[key];
    }
  });
});
var _interface5 = require("../../core/async/wrappers/interface");
Object.keys(_interface5).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _interface5[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface5[key];
    }
  });
});