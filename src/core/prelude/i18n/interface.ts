/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface Locale {
	/**
	 * The locale value
	 */
	value: CanUndef<Language>;

	/**
	 * True if the locale is already defined
	 */
	isDefined: boolean;

	/**
	 * The locale initialization promise
	 */
	isInitialized: Promise<void>;
}

export type PluralizationCount = StringPluralizationForms | string | number;
