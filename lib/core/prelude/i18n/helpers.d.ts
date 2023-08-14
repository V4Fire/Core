/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { Translation, PluralTranslation } from '../../../lang';
import type { PluralizationCount } from '../../../core/prelude/i18n/interface';
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
export declare function i18nFactory(keysetNameOrNames: string | string[], customLocale?: Language): (key: string, params?: I18nParams) => string;
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
export declare function resolveTemplate(value: Translation, params?: I18nParams): string;
/**
 * Returns the correct plural form to translate based on the given count
 *
 * @param pluralTranslation - list of translation variants
 * @param count - the value on the basis of which the form of pluralization will be selected
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
export declare function pluralizeText(pluralTranslation: PluralTranslation, count: CanUndef<PluralizationCount>): string;
