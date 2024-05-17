"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  setI18NParam: true,
  setLocale: true
};
exports.setI18NParam = setI18NParam;
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
['locale', 'region'].forEach(type => {
  if (_env.IS_NODE) {
    setI18NParam(type, _config.default[type]);
  } else {
    const value = _storage.default.get(type);
    if (value != null) {
      setI18NParam(type, value, _storage.default.get(`is${type.capitalize()}Def`));
    } else {
      setI18NParam(type, _config.default[type], true);
    }
  }
});
function setI18NParam(type, value, def) {
  const element = {
    locale: _const.locale,
    region: _const.region
  }[type];
  const oldVal = element.value;
  if (value === oldVal) {
    return;
  }
  element.value = value;
  element.isDefault = Boolean(def);
  if (!_env.IS_NODE && _storage.default.set) {
    _storage.default.set(type, value);
    _storage.default.set(`is${type.capitalize()}Def`, element.isDefault);
  }
  _const.emitter.emit(`set${type.capitalize()}`, value, oldVal);
  return value;
}
function setLocale(value, def) {
  return setI18NParam('locale', value, def);
}