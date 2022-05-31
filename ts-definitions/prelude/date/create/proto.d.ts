/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface Date {
	/**
	 * Clones the date object and returns a new object
	 */
	clone(): Date;

	/**
	 * Returns a new date based on the current so that it starts at the beginning of a day
	 */
	beginningOfDay(): Date;

	/**
	 * Returns a new date based on the current so that it starts at the ending of a day
	 */
	endOfDay(): Date;

	/**
	 * Returns a new date based on the current so that it starts at the beginning of a week
	 */
	beginningOfWeek(): Date;

	/**
	 * Returns a new date based on the current so that it starts at the ending of a week
	 */
	endOfWeek(): Date;

	/**
	 * Returns a new date based on the current so that it starts at the beginning of a month
	 */
	beginningOfMonth(): Date;

	/**
	 * Returns a new date based on the current so that it starts at the ending of a month
	 */
	endOfMonth(): Date;

	/**
	 * Returns a new date based on the current so that it starts at the beginning of a year
	 */
	beginningOfYear(): Date;

	/**
	 * Returns a new date based on the current so that it starts at the ending of a year
	 */
	endOfYear(): Date;
}
