"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  setLocale: true
};
exports.setLocale = setLocale;
var _config = _interopRequireDefault(require("../../../config"));
var _env = require("../../../core/env");
var _const = require("../../../core/prelude/i18n/const");
Object.keys(_const).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _const[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _const[key];
    }
  });
});
var _storage = _interopRequireDefault(require("../../../core/prelude/i18n/storage"));
var _helpers = require("../../../core/prelude/i18n/helpers");
Object.keys(_helpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _helpers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _helpers[key];
    }
  });
});
var _interface = require("../../../core/prelude/i18n/interface");
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
if (_env.IS_NODE) {
  setLocale(_config.default.locale);
} else {
  const locale = _storage.default.get('locale');
  if (locale != null) {
    setLocale(locale, _storage.default.get('isLocaleDef'));
  } else {
    setLocale(_config.default.locale, true);
  }
}
function setLocale(value, def) {
  const oldVal = _const.locale.value;
  if (value === oldVal) {
    return;
  }
  _const.locale.value = value;
  _const.locale.isDefault = Boolean(def);
  if (!_env.IS_NODE && _storage.default.set) {
    _storage.default.set('locale', value);
    _storage.default.set('isLocaleDef', _const.locale.isDefault);
  }
  _const.emitter.emit('setLocale', value, oldVal);
  return value;
}