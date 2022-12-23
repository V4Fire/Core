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
	value: CanUndef<string>;

	/**
	 * True if the locale is already defined
	 */
	isDefined: boolean;

	/**
	 * Promise of the locale initializing
	 */
	isInitialized: Promise<void>;
}
