/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface Locale {
	/**
	 * Locale value
	 */
	value: CanUndef<Language>;

	/**
	 * True if the locale is already defined
	 */
	isDefined: boolean;

	/**
	 * Promise of the locale initializing
	 */
	isInitialized: Promise<void>;
}

/**
 * String literal which can be used instead of numbers
 */
export type StringLiteralPluralizeForms = 'one' | 'some' | 'many' | 'none';

/**
 * Format of parameters for the i18n function
 */
export type i18nParams = {
	count: number | StringLiteralPluralizeForms;
} & {
	[key: string]: string;
};
