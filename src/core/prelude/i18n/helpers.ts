/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import log from 'core/log';
import extend from 'core/prelude/extend';

import langPacs, { Translation, PluralTranslation } from 'lang';

import { locale, pluralizeMap } from 'core/prelude/i18n/const';
import type { PluralizationCount } from 'core/prelude/i18n/interface';

/** @see [[i18n]] */
extend(globalThis, 'i18n', i18nFactory);

const
	logger = log.namespace('i18n');

/**
 * Creates a function to internationalize strings in an application based on the given locale and keyset.
 * Keyset allows you to share the same keys in different contexts.
 * For example, the key "Next" may have a different value in different components of the application, therefore,
 * we can use the name of the component as a keyset value.
 *
 * @param keysetNameOrNames - the name of keyset or array with names of keysets to use.
 *   If passed as an array, the priority of the cases will be arranged in the order of the elements,
 *   the first one will have the highest priority.
 *
 * @param [customLocale] - the locale used to search for translations (the default is taken from
 *   the application settings)
 */
export function i18nFactory(
	keysetNameOrNames: string | string[], customLocale?: Language
): (key: string, params?: I18nParams) => string {
	const
		resolvedLocale = customLocale ?? locale.value,
		keysetNames = Object.isArray(keysetNameOrNames) ? keysetNameOrNames : [keysetNameOrNames];

	if (resolvedLocale == null) {
		throw new ReferenceError('The locale for internationalization is not defined');
	}

	const pluralRules: Nullable<Intl.PluralRules> = 'PluralRules' in globalThis['Intl'] ? new globalThis['Intl'].PluralRules(resolvedLocale) : null;

	return function i18n(value: string | TemplateStringsArray, params?: I18nParams) {
		if (Object.isArray(value) && value.length !== 1) {
			throw new SyntaxError('Using i18n with template literals is allowed only without variables');
		}

		if (params?.rules == null) {
			params = Object.mixin({}, params, {rules: pluralRules});
		}

		const
			key = Object.isString(value) ? value : value[0],
			correctKeyset = keysetNames.find((keysetName) => langPacs[resolvedLocale]?.[keysetName]?.[key]),
			translateValue = langPacs[resolvedLocale]?.[correctKeyset ?? '']?.[key];

		if (translateValue != null && translateValue !== '') {
			return resolveTemplate(translateValue, params);
		}

		logger.error(
			'Translation for the given key is not found',
			`Key: ${key}, KeysetNames: ${keysetNames.join(', ')}, LocaleName: ${resolvedLocale}, available locales: ${Object.keys(langPacs).join(', ')}`
		);

		return resolveTemplate(key, params);
	};
}

/**
 * Returns the form for plural sentences and resolves variables from the passed template
 *
 * @param value - a string for the default case, or an array of strings for the plural case
 * @param params - a dictionary with parameters for internationalization
 *
 * @example
 * ```typescript
 * const example = resolveTemplate('My name is {name}, I live in {city}', {name: 'John', city: 'Denver'});
 *
 * console.log(example); // 'My name is John, I live in Denver'
 *
 * const examplePluralize = resolveTemplate({
 *  one: {count} product,
 *  few: {count} products,
 *  many: {count} products,
 *  zero: {count} products,
 * }, {count: 5});
 *
 * console.log(examplePluralize); // '5 products'
 * ```
 */
export function resolveTemplate(value: Translation, params?: I18nParams): string {
	const
		template = Object.isPlainObject(value) ? pluralizeText(value, params?.count, params?.rules) : value;

	return template.replace(/{([^}]+)}/g, (_, key) => {
		if (params?.[key] == null) {
			logger.error('Undeclared variable', `Name: "${key}", Template: "${template}"`);
			return key;
		}

		return params[key];
	});
}

/**
 * Returns the correct plural form to translate based on the given count
 *
 * @param pluralTranslation - list of translation variants
 * @param count - the value on the basis of which the form of pluralization will be selected
 * @param rules - Intl plural rules for selected locale
 *
 * @example
 * ```typescript
 * const result = pluralizeText({
 *  one: {count} product,
 *  few: {count} products,
 *  many: {count} products,
 *  zero: {count} products,
 *  other: {count} products,
 * }, 5, new Intl.PluralRulse('en'));
 *
 * console.log(result); // '{count} products'
 * ```
 */
export function pluralizeText(
	pluralTranslation: PluralTranslation,
	count: CanUndef<PluralizationCount>,
	rules: CanUndef<Intl.PluralRules>
): string {
	let normalizedCount;

	if (Object.isNumber(count)) {
		normalizedCount = count;

	} else if (Object.isString(count)) {
		if (count in pluralizeMap) {
			normalizedCount = pluralizeMap[count];
		}
	}

	if (normalizedCount == null) {
		logger.error('Invalid value of the `count` parameter for string pluralization', `String: ${pluralTranslation[0]}`);
		normalizedCount = 1;
	}

	const
		pluralFormName = getPluralFormName(normalizedCount, rules),
		translation = pluralTranslation[pluralFormName];

	if (translation == null) {
		logger.error(`Plural form ${pluralFormName} doesn't exist.`, `String: ${pluralTranslation[0]}`);
		return pluralTranslation.one;
	}

	return translation;
}

function getPluralFormName(n: number, rules: CanUndef<Intl.PluralRules>): keyof Required<PluralTranslation> {
	if (rules != null) {
		return <keyof PluralTranslation>rules.select(n);
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
