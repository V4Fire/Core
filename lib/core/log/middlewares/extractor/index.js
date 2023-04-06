"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  ExtractorMiddleware: true
};
Object.defineProperty(exports, "ExtractorMiddleware", {
  enumerable: true,
  get: function () {
    return _extractor.ExtractorMiddleware;
  }
});
var _extractor = require("../../../../core/log/middlewares/extractor/extractor");
var _interface = require("../../../../core/log/middlewares/extractor/interface");
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