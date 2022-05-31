/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

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
 * Global i18n function (can be used as a string tag or simple function)
 */
declare function i18n(strings: any | string[], ...expr: any[]): string;

/**
 * @alias
 * @see globalI18n
 */
declare function t(strings: any | string[], ...expr: any[]): string;

/**
 * Global i18n loopback (can be used as a string tag or simple function)
 */
declare function l(strings: any | string[], ...expr: any[]): string;
