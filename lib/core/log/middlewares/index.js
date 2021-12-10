"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  creatorFor: true,
  extend: true,
  Extended: true
};
Object.defineProperty(exports, "Extended", {
  enumerable: true,
  get: function () {
    return _base.Extended;
  }
});
exports.creatorFor = creatorFor;
exports.default = void 0;
Object.defineProperty(exports, "extend", {
  enumerable: true,
  get: function () {
    return _base.extend;
  }
});

var _configurable = require("../../../core/log/middlewares/configurable");

var _extractor = require("../../../core/log/middlewares/extractor");

var _errorsDeduplicator = require("../../../core/log/middlewares/errors-deduplicator");

var _base = require("../../../core/log/base");

var _interface = require("../../../core/log/middlewares/interface");

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

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Returns a function that creates a middleware of the specified class
 * @param Ctor - constructor or just a class
 */
function creatorFor(Ctor) {
  return (...args) => new Ctor(...args);
}

const middlewareFactory = {
  configurable: creatorFor(_configurable.ConfigurableMiddleware),
  extractor: creatorFor(_extractor.ExtractorMiddleware),
  errorsDeduplicator: creatorFor(_errorsDeduplicator.ErrorsDeduplicatorMiddleware)
};
var _default = middlewareFactory;
exports.default = _default;