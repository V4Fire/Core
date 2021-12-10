"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _interface = require("../../../core/log/config/interface");

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

var _styles = require("../../../core/log/config/styles");

Object.keys(_styles).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _styles[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _styles[key];
    }
  });
});

var _pipeline = require("../../../core/log/config/pipeline");

Object.keys(_pipeline).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _pipeline[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _pipeline[key];
    }
  });
});