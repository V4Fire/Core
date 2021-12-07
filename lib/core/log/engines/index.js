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

var _console = require("../../../core/log/engines/console");

var _base = require("../../../core/log/base");

var _interface = require("../../../core/log/engines/interface");

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
 * Returns a function that creates an engine of the specified class
 * @param Ctor - constructor or just a class
 */
function creatorFor(Ctor) {
  return opts => new Ctor(opts);
}

const engineFactory = {
  console: creatorFor(_console.ConsoleEngine)
};
var _default = engineFactory;
exports.default = _default;