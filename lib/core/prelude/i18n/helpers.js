"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPluralFormName = getPluralFormName;
exports.getPluralRules = getPluralRules;
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
  const pluralRules = getPluralRules(resolvedLocale);
  return function i18n(value, params) {
    if (Object.isArray(value) && value.length !== 1) {
      throw new SyntaxError('Using i18n with template literals is allowed only without variables');
    }
    const key = Object.isString(value) ? value : value[0],
      correctKeyset = keysetNames.find(keysetName => _lang.default[resolvedLocale]?.[keysetName]?.[key]),
      translateValue = _lang.default[resolvedLocale]?.[correctKeyset ?? '']?.[key],
      meta = {
        language: resolvedLocale,
        keyset: correctKeyset,
        key
      };
    if (translateValue != null && translateValue !== '') {
      return resolveTemplate(translateValue, params, {
        pluralRules,
        meta
      });
    }
    logger.error('Translation for the given key is not found', `Key: ${key}, KeysetNames: ${keysetNames.join(', ')}, LocaleName: ${resolvedLocale}, available locales: ${Object.keys(_lang.default).join(', ')}`);
    return resolveTemplate(key, params, {
      pluralRules,
      meta
    });
  };
}
function resolveTemplate(value, params, opts = {}) {
  const template = Object.isPlainObject(value) ? pluralizeText(value, params?.count, opts) : value;
  return template.replace(/{([^}]+)}/g, (_, key) => {
    if (params?.[key] == null) {
      logger.error('Undeclared variable', `Name: "${key}", Template: "${template}"`);
      return key;
    }
    return params[key];
  });
}
function pluralizeText(pluralTranslation, count, opts = {}) {
  const {
    pluralRules,
    meta
  } = opts;
  let normalizedCount;
  if (Object.isNumber(count)) {
    normalizedCount = count;
  } else if (Object.isString(count)) {
    const translation = pluralTranslation[count];
    if (translation != null) {
      return translation;
    }
  }
  if (normalizedCount == null) {
    logger.error('Invalid value of the `count` parameter for string pluralization', `Count: ${count}, Key: ${meta?.key}, Language: ${meta?.language}, Keyset: ${meta?.keyset}`);
    normalizedCount = 1;
  }
  const pluralFormName = getPluralFormName(normalizedCount, pluralRules),
    translation = pluralTranslation[pluralFormName];
  if (translation == null) {
    logger.error(`Plural form ${pluralFormName} doesn't exist.`, `Key: ${meta?.key}, Language: ${meta?.language}, Keyset: ${meta?.keyset}`);
    return pluralTranslation.one;
  }
  return translation;
}
function getPluralFormName(n, rules) {
  if (rules != null) {
    return rules.select(n);
  }
  switch (n) {
    case 0:
      return 'zero';
    case 1:
      return 'one';
    default:
      if (n > 1 && n < 5) {
        return 'few';
      }
      return 'many';
  }
}
function getPluralRules(locale) {
  if ('PluralRules' in globalThis['Intl']) {
    return new globalThis['Intl'].PluralRules(locale);
  }
}