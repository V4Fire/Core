"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _wrapper = _interopRequireDefault(require("../../../../core/cache/decorators/persistent/wrapper"));
var _interface = require("../../../../core/cache/decorators/persistent/interface");
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
const addPersistent = (cache, storage, opts) => new _wrapper.default(cache, storage, opts).getInstance();
var _default = addPersistent;
exports.default = _default;