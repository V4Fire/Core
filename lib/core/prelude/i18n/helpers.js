"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.i18nFactory = i18nFactory;
exports.pluralizeText = pluralizeText;
exports.resolveTemplate = resolveTemplate;
var _log = _interopRequireDefault(require("../../../core/log"));
var _lang = _interopRequireDefault(require("../../../lang"));
var _const = require("../../../core/prelude/i18n/const");
const logger = _log.default.namespace('i18n');
function i18nFactory(keysetNameOrNames, customLocale) {
  const resolvedLocale = customLocale ?? _const.locale.value,
    keysetNames = Object.isArray(keysetNameOrNames) ? keysetNameOrNames : [keysetNameOrNames];
  if (resolvedLocale == null) {
    throw new ReferenceError('The locale for internationalization is not defined');
  }
  return function i18n(value, params) {
    if (Object.isArray(value) && value.length !== 1) {
      throw new SyntaxError('Using i18n with template literals is allowed only without variables');
    }
    const key = Object.isString(value) ? value : value[0],
      correctKeyset = keysetNames.find(keysetName => _lang.default[resolvedLocale]?.[keysetName]?.[key]),
      translateValue = _lang.default[resolvedLocale]?.[correctKeyset ?? '']?.[key];
    if (translateValue != null && translateValue !== '') {
      return resolveTemplate(translateValue, params);
    }
    logger.error('Translation for the given key is not found', `Key: ${key}, KeysetNames: ${keysetNames.join(', ')}, LocaleName: ${resolvedLocale}, available locales: ${Object.keys(_lang.default).join(', ')}`);
    return resolveTemplate(key, params);
  };
}
function resolveTemplate(value, params) {
  const template = Object.isArray(value) ? pluralizeText(value, params?.count) : value;
  return template.replace(/{([^}]+)}/g, (_, key) => {
    if (params?.[key] == null) {
      logger.error('Undeclared variable', `Name: "${key}", Template: "${template}"`);
      return key;
    }
    return params[key];
  });
}
function pluralizeText(pluralTranslation, count) {
  let normalizedCount;
  if (Object.isNumber(count)) {
    normalizedCount = count;
  } else if (Object.isString(count)) {
    if (count in _const.pluralizeMap) {
      normalizedCount = _const.pluralizeMap[count];
    }
  }
  if (normalizedCount == null) {
    logger.error('Invalid value of the `count` parameter for string pluralization', `String: ${pluralTranslation[0]}`);
    normalizedCount = 1;
  }
  switch (normalizedCount) {
    case 0:
      return pluralTranslation[3];
    case 1:
      return pluralTranslation[0];
    default:
      if (normalizedCount > 1 && normalizedCount < 5) {
        return pluralTranslation[1];
      }
      return pluralTranslation[2];
  }
}