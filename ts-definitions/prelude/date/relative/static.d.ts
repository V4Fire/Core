/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface DateConstructor {
	/**
	 * Maps the specified date to the current (Date.now()) date and returns difference
	 * @param date
	 */
	relative(date: DateCreateValue): DateRelative;

	/**
	 * Returns a curried version of `Date.relativeTo`
	 * @param from
	 */
	relativeTo(from: DateCreateValue): (to: DateCreateValue) => DateRelative;

	/**
	 * Maps the one date to another and returns difference
	 *
	 * @param from
	 * @param to
	 */
	relativeTo(from: DateCreateValue, to: DateCreateValue): DateRelative;
}
