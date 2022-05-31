/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface Date {
	/**
	 * Returns a relative value of the date for the now date
	 */
	relative(): DateRelative;

	/**
	 * Returns a relative value of the date for another date
	 * @param date - another date to compare
	 */
	relativeTo(date: DateCreateValue): DateRelative;
}
