"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _attachMock = require("../../../core/data/middlewares/attach-mock");

Object.keys(_attachMock).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _attachMock[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _attachMock[key];
    }
  });
});

var _attachStatus = require("../../../core/data/middlewares/attach-status");

Object.keys(_attachStatus).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _attachStatus[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _attachStatus[key];
    }
  });
});

var _wait = require("../../../core/data/middlewares/wait");

Object.keys(_wait).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _wait[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _wait[key];
    }
  });
});