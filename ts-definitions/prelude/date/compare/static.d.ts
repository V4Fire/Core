/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface DateConstructor {
	/**
	 * Returns a curried version of `Date.is`
	 *
	 * @param margin - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 *
	 * @param date1 - date to compare
	 */
	is(margin: number, date1: DateCreateValue): (date2: DateCreateValue) => boolean;

	/**
	 * Returns a curried version of `Date.is`
	 * @param date1 - date to compare
	 */
	is(date1: DateCreateValue): (date2: DateCreateValue, margin?: number) => boolean;

	/**
	 * Returns true if the one date is equals to another
	 *
	 * @param date1 - date to compare
	 * @param date2 - another date to compare
	 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 */
	is(date1: DateCreateValue, date2: DateCreateValue, margin?: number): boolean;

	/**
	 * Returns a curried version of `Date.isAfter`
	 *
	 * @param margin - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 *
	 * @param date1 - date to compare
	 */
	isAfter(margin: number, date1: DateCreateValue): (date2: DateCreateValue) => boolean;

	/**
	 * Returns a curried version of `Date.isAfter`
	 * @param date1 - date to compare
	 */
	isAfter(date1: DateCreateValue): (date2: DateCreateValue, margin?: number) => boolean;

	/**
	 * Returns true if the one date is greater than another
	 *
	 * @param date1 - date to compare
	 * @param date2 - another date to compare
	 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 */
	isAfter(date1: DateCreateValue, date2: DateCreateValue, margin?: number): boolean;

	/**
	 * Returns a curried version of `Date.isBefore`
	 *
	 * @param margin - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 *
	 * @param date1 - date to compare
	 */
	isBefore(margin: number, date1: DateCreateValue): (date2: DateCreateValue) => boolean;

	/**
	 * Returns a curried version of `Date.isBefore`
	 * @param date1 - date to compare
	 */
	isBefore(date1: DateCreateValue): (date2: DateCreateValue, margin?: number) => boolean;

	/**
	 * Returns true if the one date is less than another
	 *
	 * @param date1 - date to compare
	 * @param date2 - another date to compare
	 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 */
	isBefore(date1: DateCreateValue, date2: DateCreateValue, margin?: number): boolean;

	/**
	 * Returns a curried version of `Date.isBetween`
	 *
	 * @param margin - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 */
	isBetween(margin: number): (date: Date, left?: Date, right?: Date) => boolean;

	/**
	 * Returns a curried version of `Date.isBetween`
	 *
	 * @param [left] - date of the beginning
	 * @param [right] - date of the ending
	 */
	isBetween(left?: DateCreateValue, right?: DateCreateValue):
		(date: Date, left?: Date, right?: Date, margin?: number) => boolean;

	/**
	 * Returns true if the date is between of two other (including the bounding dates)
	 *
	 * @param date - date to check
	 * @param left - date of the beginning
	 * @param right - date of the ending
	 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
	 *   (in milliseconds)
	 */
	isBetween(date: Date, left: DateCreateValue, right: DateCreateValue, margin?: number): boolean;
}
