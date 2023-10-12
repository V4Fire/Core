/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

declare const SSR: boolean;

/**
 * Application name
 */
declare const APP_NAME: string;

/**
 * Base API URL
 */
declare const API_URL: CanUndef<string>;

/**
 * System default locale
 */
declare const LOCALE: string;

/**
 * Is the application built in a debug mode
 */
declare const DEBUG: boolean;

/**
 * Is the application built in a production mode
 */
declare const IS_PROD: boolean;

/**
 * Converts the specified unknown value to any
 * @param obj
 */
declare function Any(obj: any): any;

/**
 * STDERR wrapper
 * @param err
 */
declare function stderr(err: any): void;

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
declare function i18n(
	keysetNameOrNames: CanArray<string>, customLocale?: Language
): (key: string | TemplateStringsArray, params?: I18nParams) => string;

/**
 * Parameters for the internationalization function
 */
type I18nParams = {count?: number | StringPluralizationForms} & {
	[key: string]: string | number;
};

type Language =
	'be' | 'en' | 'kk' |
	'ru' | 'tr' | 'tt' |
	'uk' | 'id' | 'uz' |
	'es' | 'de' | 'hy' |
	'ka' | 'ky' | 'sr' |
	'fr' | 'lv' | 'lt' |
	'ro' | 'fi' | 'az' |
	'zh' | 'he' | 'et' |
	'no' | 'sv' | 'pt' |
	'ar' | 'sw';

/**
 * String pluralization constants that can be used instead of numbers
 */
type StringPluralizationForms = 'one' | 'some' | 'many' | 'none';
