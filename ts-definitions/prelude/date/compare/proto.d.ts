/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface Date {
	/**
	 * Returns true if the date is equals to another
	 *
	 * @param date - another date to compare
	 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
	 * (in milliseconds)
	 */
	is(date: DateCreateValue, margin?: number): boolean;

	/**
	 * Returns true if the date is greater than another
	 *
	 * @param date - another date to compare
	 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
	 * (in milliseconds)
	 */
	isAfter(date: DateCreateValue, margin?: number): boolean;

	/**
	 * Returns true if the date is less than another
	 *
	 * @param date - another date to compare
	 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
	 * (in milliseconds)
	 */
	isBefore(date: DateCreateValue, margin?: number): boolean;

	/**
	 * Returns true if the date is between of two other (including the bounding dates)
	 *
	 * @param left - date of the beginning
	 * @param right - date of the ending
	 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
	 * (in milliseconds)
	 */
	isBetween(left: DateCreateValue, right: DateCreateValue, margin?: number): boolean;

	/**
	 * Returns true if the date is less than the now date
	 */
	isPast(): boolean;

	/**
	 * Returns true if the date is greater than the now date
	 */
	isFuture(): boolean;
}
