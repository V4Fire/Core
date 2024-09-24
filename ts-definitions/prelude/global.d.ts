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
declare const LOCALE: Language;

/**
 * System default region
 */
declare const REGION: Region;

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

type i18n = (key: string | TemplateStringsArray, params?: I18nParams) => string;

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
type i18nFactory = (
	keysetNameOrNames: CanArray<string>, customLocale?: Language
) => i18n;

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
 * ISO 3166-1
 * @see https://en.wikipedia.org/wiki/ISO_3166-1
 */
type Region =
	'AD' | 'AE' | 'AF' | 'AG' | 'AI' | 'AL' | 'AM' |
	'AO' | 'AQ' | 'AR' | 'AS' | 'AT' | 'AU' | 'AW' |
	'AX' | 'AZ' | 'BA' | 'BB' | 'BD' | 'BE' | 'BF' |
	'BG' | 'BH' | 'BI' | 'BJ' | 'BL' | 'BM' | 'BN' |
	'BO' | 'BQ' | 'BR' | 'BS' | 'BT' | 'BV' | 'BW' |
	'BY' | 'BZ' | 'CA' | 'CC' | 'CD' | 'CF' | 'CG' |
	'CH' | 'CI' | 'CK' | 'CL' | 'CM' | 'CN' | 'CO' |
	'CR' | 'CU' | 'CV' | 'CW' | 'CX' | 'CY' | 'CZ' |
	'DE' | 'DJ' | 'DK' | 'DM' | 'DO' | 'DZ' | 'EC' |
	'EE' | 'EG' | 'EH' | 'ER' | 'ES' | 'ET' | 'FI' |
	'FJ' | 'FK' | 'FM' | 'FO' | 'FR' | 'GA' | 'GB' |
	'GD' | 'GE' | 'GF' | 'GG' | 'GH' | 'GI' | 'GL' |
	'GM' | 'GN' | 'GP' | 'GQ' | 'GR' | 'GS' | 'GT' |
	'GU' | 'GW' | 'GY' | 'HK' | 'HM' | 'HN' | 'HR' |
	'HT' | 'HU' | 'ID' | 'IE' | 'IL' | 'IM' | 'IN' |
	'IO' | 'IQ' | 'IR' | 'IS' | 'IT' | 'JE' | 'JM' |
	'JO' | 'JP' | 'KE' | 'KG' | 'KH' | 'KI' | 'KM' |
	'KN' | 'KP' | 'KR' | 'KW' | 'KY' | 'KZ' | 'LA' |
	'LB' | 'LC' | 'LI' | 'LK' | 'LR' | 'LS' | 'LT' |
	'LU' | 'LV' | 'LY' | 'MA' | 'MC' | 'MD' | 'ME' |
	'MF' | 'MG' | 'MH' | 'MK' | 'ML' | 'MM' | 'MN' |
	'MO' | 'MP' | 'MQ' | 'MR' | 'MS' | 'MT' | 'MU' |
	'MV' | 'MW' | 'MX' | 'MY' | 'MZ' | 'NA' | 'NC' |
	'NE' | 'NF' | 'NG' | 'NI' | 'NL' | 'NO' | 'NP' |
	'NR' | 'NU' | 'NZ' | 'OM' | 'PA' | 'PE' | 'PF' |
	'PG' | 'PH' | 'PK' | 'PL' | 'PM' | 'PN' | 'PR' |
	'PS' | 'PT' | 'PW' | 'PY' | 'QA' | 'RE' | 'RO' |
	'RS' | 'RU' | 'RW' | 'SA' | 'SB' | 'SC' | 'SD' |
	'SE' | 'SG' | 'SH' | 'SI' | 'SJ' | 'SK' | 'SL' |
	'SM' | 'SN' | 'SO' | 'SR' | 'SS' | 'ST' | 'SV' |
	'SX' | 'SY' | 'SZ' | 'TC' | 'TD' | 'TF' | 'TG' |
	'TH' | 'TJ' | 'TK' | 'TL' | 'TM' | 'TN' | 'TO' |
	'TR' | 'TT' | 'TV' | 'TW' | 'TZ' | 'UA' | 'UG' |
	'UM' | 'US' | 'UY' | 'UZ' | 'VA' | 'VC' | 'VE' |
	'VG' | 'VI' | 'VN' | 'VU' | 'WF' | 'WS' | 'YE' |
	'YT' | 'ZA' | 'ZM' | 'ZW';

/**
 * String pluralization constants that can be used instead of numbers
 */
type StringPluralizationForms = 'one' | 'two' | 'few' | 'many' | 'other' | 'zero';
