/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import log from 'core/log';

import type { TranslateValue, PluralTranslateValue } from 'lang';
import langDict from 'lang';
import { locale, pluralizeMap } from 'core/prelude/i18n/const';

/** @see [[i18n]] */
extend(globalThis, 'i18n', globalI18n);

/** @see [[t]] */
extend(globalThis, 't', globalI18n);

const
	logger = log.namespace('i18n');

/**
 * Global i18n function
 * Allows you to access a specific keyset inside all translations
 *
 * @param keysetName - string
 * @param [customLocale] - allows you to use translation in a language other than the language of the application
 */
export function globalI18n(keysetName: string, customLocale?: Language): (key: string, params?: i18nParams) => string {
	const
		localeName = customLocale == null ? locale.value : customLocale,
		keyset = langDict[localeName!]?.[keysetName];

	return function I18nForKeyset(key: string, params?: i18nParams) {
		if (!Object.isDictionary(keyset)) {
			logger.error('Keyset does not exist', `KeysetName: ${keysetName}, LocaleName: ${localeName}`);

			return resolveTemplate(key, params);
		}

		const
			translateValue = keyset[key];

		if (translateValue != null) {
			return resolveTemplate(translateValue, params);
		}

		logger.error('Value does not exist', `KeysetName: ${keysetName}, LocaleName: ${localeName}, Key: ${key}`);

		return resolveTemplate(key, params);
	};
}

/**
 * Selects a form for pluralized sentences and resolve variables from the passed template
 *
 * @param value - string for default case and Array<string> for pluralize case
 * @param params - Dictionary with {[keys]: values that will replace the keys}
 * @returns string
 *
 * @example
 * ```typescript
 * const example = resolveTemplate('My name is {name}, I live in {city}', {name: 'John', city: 'Denver'});
 *
 * console.log(example); // 'My name is John, I live in Denver'
 *
 * const examplePluralize = resolveTemplate([
 *  {count} product,  // One
 *  {count} products, // Some
 *  {count} products, // Many
 *  {count} products, // None
 * ], {count: 5});
 *
 * console.log(examplePluralize); // '5 products'
 * ```
 */
export function resolveTemplate(value: TranslateValue, params?: i18nParams): string {
	const
		template = Object.isArray(value) ? pluralizeText(value, params?.count) : value;

	return template.replace(/{(.*?)}/gi, (_, key) => {
		if (params?.[key] == null) {
			logger.error('Undeclared variable', `"${key}" used in template: "${template}"`);
			return key;
		}

		return params[key];
	});
}

/**
 * Based on the passed count parameter, the correct pluralized form of the text is selected
 *
 * @param text - PluralTranslateValue
 * @param count - number | string
 * @returns string
 *
 * @example
 * ```typescript
 * const result = pluralizeText([
 *  {count} product,  // One
 *  {count} products, // Some
 *  {count} products, // Many
 *  {count} products, // None
 * ], 5);
 *
 * console.log(result); // '{count} products'
 * ```
 */
export function pluralizeText(text: PluralTranslateValue, count: CanUndef<number | string>): string {
	let normalizedCount;

	if (Object.isNumber(count)) {
		normalizedCount = count;

	} else if (Object.isString(count)) {
		if (['none', 'one', 'many', 'some'].includes(count)) {
			normalizedCount = pluralizeMap[<StringLiteralPluralizeForms>count];
		}
	}

	if (normalizedCount == null) {
		logger.error('Plural string with incorrect param count', `Plural string: ${text[0]}`);
		normalizedCount = 1;
	}

	if (normalizedCount === 0) {
		return text[3];
	}

	if (normalizedCount === 1) {
		return text[0];
	}

	if (normalizedCount > 1 && normalizedCount < 5) {
		return text[1];
	}

	return text[2];
}
