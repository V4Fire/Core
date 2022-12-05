/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import log from 'core/log';

import type { Language, TranslateValue, PluralTranslateValue } from 'lang';
import langDict from 'lang';
import { locale, pluralizeMap } from 'core/prelude/i18n/const';
import type { StringLiteralPluralizeForms, i18nParams } from 'core/prelude/i18n/interface';

/** @see [[i18n]] */
extend(globalThis, 'i18n', globalI18n);

/** @see [[t]] */
extend(globalThis, 't', globalI18n);

const
	logger = log.namespace('i18n');

/**
 * Global i18n function
 *
 * @param keysetName - string
 * @param [customLocale] - Language
 * @returns (key, params) => string
 */
function globalI18n(keysetName: string, customLocale?: Language) {
	const
		localeName = customLocale == null ? locale.value : customLocale,
		keyset = langDict[localeName!]?.[keysetName];

	return function I18nForKeyset(key: string, params?: i18nParams) {
		if (!Object.isDictionary(keyset)) {
			logger.error('Keyset does not exist', `KeysetName: ${keysetName}, LocaleName: ${localeName}`);

			return generateText(key, params);
		}

		const
			translateValue = keyset[key];

		if (translateValue != null) {
			return generateText(translateValue, params);
		}

		logger.error('Value does not exist', `KeysetName: ${keysetName}, LocaleName: ${localeName}, Key: ${key}`);

		return generateText(key, params);
	};
}

/**
 * Generates text from the passed template
 *
 * @param value - TranslateValue
 * @param params - i18nParams
 * @returns string
 */
function generateText(value: TranslateValue, params?: i18nParams): string {
	const
		template = Object.isArray(value) ? pluralizeText(value, params?.count) : value,
		len = template.length;

	let
		text = '',
		pos = 0;

	while (pos < len) {
		const p1 = template.indexOf('{', pos);
		if (p1 === -1) {
			text += template.substring(pos);
			return text;
		}

		const p2 = template.indexOf('}', p1);
		if (p2 === -1) {
			text += template.substring(pos);
			return text;
		}

		text += template.substring(pos, p1);

		const
			key = template.substring(p1 + 1, p2);

		if (params?.[key] == null) {
			logger.error('Undeclared variable', `"${key}" used in template: "${template}"`);
			text += key;
		} else {
			text += params[key];
		}

		pos = p2 + 1;
	}

	return text;
}

/**
 * Select correct form of text
 *
 * @param text - PluralTranslateValue
 * @param count - number | string
 * @returns string
 */
function pluralizeText(text: PluralTranslateValue, count: CanUndef<number | string>): string {
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
