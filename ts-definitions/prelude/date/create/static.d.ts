/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface DateConstructor {
	/**
	 * Creates a date from the specified pattern.
	 * This method can create a new date object from:
	 *
	 *  1. another date object
	 *  1. number of milliseconds (if the number is integer)
	 *  1. number of seconds (if the number is float)
	 *  1. string pattern by using the native `Date.parse` with some polyfills
	 *  1. string aliases:
	 *     1. `'now'` - is an alias for the now date
	 *     1. `'today'` - is an alias for the beginning of the today
	 *     1. `'yesterday'` - is an alias for the beginning of the yesterday
	 *     1. `'tomorrow'` - is an alias for the beginning of the tomorrow
	 *
	 * @param [pattern]
	 * @param [opts]
	 *
	 * @example
	 * ```js
	 * Date.create('now'); // new Date(Date.now())
	 * Date.create(Date.now()); // new Date(Date.now())
	 * ```
	 */
	create(pattern?: DateCreateValue, opts?: DateCreateOptions): Date;

	/**
	 * Returns a new date based on the current so that it starts at the beginning of a day
	 * @param date
	 */
	beginningOfDay(date: Date): Date;

	/**
	 * Returns a new date based on the current so that it starts at the ending of a day
	 * @param date
	 */
	endOfDay(date: Date): Date;

	/**
	 * Returns a new date based on the current so that it starts at the beginning of a week
	 * @param date
	 */
	beginningOfWeek(date: Date): Date;

	/**
	 * Returns a new date based on the current so that it starts at the ending of a week
	 * @param date
	 */
	endOfWeek(date: Date): Date;

	/**
	 * Returns a new date based on the current so that it starts at the beginning of a month
	 * @param date
	 */
	beginningOfMonth(date: Date): Date;

	/**
	 * Returns a new date based on the current so that it starts at the ending of a month
	 * @param date
	 */
	endOfMonth(date: Date): Date;

	/**
	 * Returns a new date based on the current so that it starts at the beginning of a year
	 * @param date
	 */
	beginningOfYear(date: Date): Date;

	/**
	 * Returns a new date based on the current so that it starts at the ending of a year
	 * @param date
	 */
	endOfYear(date: Date): Date;
}
