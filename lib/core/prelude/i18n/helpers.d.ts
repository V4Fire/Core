/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { Translation, PluralTranslation } from '../../../lang';
import type { I18nOpts, PluralizationCount } from '../../../core/prelude/i18n/interface';
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
export declare function i18nFactory(keysetNameOrNames: string | string[], customLocale?: Language): (key: string | TemplateStringsArray, params?: I18nParams) => string;
/**
 * Returns the form for plural sentences and resolves variables from the passed template
 *
 * @param value - a string for the default case, or an array of strings for the plural case
 * @param params - a dictionary with parameters for internationalization
 * @params [opts] - additional options for current translation
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
export declare function resolveTemplate(value: Translation, params?: I18nParams, opts?: I18nOpts): string;
/**
 * Returns the correct plural form to translate based on the given count
 *
 * @param pluralTranslation - list of translation variants
 * @param count - the value on the basis of which the form of pluralization will be selected
 * @params [opts] - additional options for current translation
 *
 * @example
 * ```typescript
 * const result = pluralizeText({
 *  one: {count} product,
 *  few: {count} products,
 *  many: {count} products,
 *  zero: {count} products,
 *  other: {count} products,
 * }, 5, {pluralRules: new Intl.PluralRulse('en')});
 *
 * console.log(result); // '{count} products'
 * ```
 */
export declare function pluralizeText(pluralTranslation: PluralTranslation, count: CanUndef<PluralizationCount>, opts?: I18nOpts): string;
/**
 * Returns the plural form name for a given number `n` based on the specified pluralization rules.
 * Otherwise will be used default set of rules.
 *
 * If a `rules` object implementing `Intl.PluralRules` is provided, it will use that to determine the plural form.
 * Otherwise, it will fall back to a custom rule set:
 * - Returns 'zero' for `n === 0`.
 * - Returns 'one' for `n === 1`.
 * - Returns 'few' for `n > 1 && n < 5`.
 * - Returns 'many' for all other values of `n`.
 *
 * @param n - The number to evaluate for pluralization.
 * @param rules - Plural rules object. If undefined, a default rule set is used.
 */
export declare function getPluralFormName(n: number, rules?: CanUndef<Intl.PluralRules>): keyof Required<PluralTranslation>;
/**
 * Returns an instance of `Intl.PluralRules` for a given locale, if supported.
 * @param locale - The locale for which to generate plural rules.
 */
export declare function getPluralRules(locale: Language): CanUndef<Intl.PluralRules>;
