"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _iterators = require("../../../core/prelude/string/iterators");

Object.keys(_iterators).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _iterators[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _iterators[key];
    }
  });
});

var _transformers = require("../../../core/prelude/string/transformers");

Object.keys(_transformers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _transformers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _transformers[key];
    }
  });
});