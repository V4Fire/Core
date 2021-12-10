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

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

let storage; // eslint-disable-next-line prefer-const

storage = Promise.resolve().then(() => _interopRequireWildcard(require('../../../core/kv-storage'))).then(({
  asyncLocal
}) => asyncLocal.namespace('[[I18N]]'));

if (_env.IS_NODE) {
  setLocale(_config.default.locale);
} else {
  _const.locale.isInitialized = (async () => {
    try {
      const s = await storage,
            l = await s.get('locale');

      if (l != null) {
        setLocale(l, await s.get('isLocaleDef'));
        return;
      }

      throw new Error('Default language');
    } catch {
      setLocale(_config.default.locale, true);
    }
  })();
}
/**
 * Sets a new system language
 *
 * @param [value]
 * @param [def] - if true, then the language is marked as default
 * @emits `setLocale(value: string, oldValue?: string)`
 */


function setLocale(value, def) {
  const oldVal = _const.locale.value;
  _const.locale.value = value;
  _const.locale.isDefined = Boolean(def);

  if (!_env.IS_NODE && storage != null) {
    storage.then(storage => Promise.all([storage.set('locale', value), storage.set('isLocaleDef', _const.locale.isDefined)])).catch(stderr);
  }

  _const.emitter.emit('setLocale', value, oldVal);

  return value;
}