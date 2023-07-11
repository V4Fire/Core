/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface DateConstructor {
	/**
	 * Returns a curried version of ``Date.add``
	 *
	 * @param units
	 * @param reset - if true, then all lower units will be reset to zero
	 */
	add(units: DateSetParams, reset?: boolean): (date: Date) => Date;

	/**
	 * Modifies the date with adding time units
	 *
	 * @param date
	 * @param units
	 * @param reset - if true, then all lower units will be reset to zero
	 */
	add(date: Date, units: DateSetParams, reset?: boolean): Date;

	/**
	 * Returns a curried version of `Date.set`
	 *
	 * @param units
	 * @param reset - if true, then all lower units will be reset to zero
	 */
	set(units: DateSetParams, reset?: boolean): (date: Date) => Date;

	/**
	 * Modifies the date with setting time units
	 *
	 * @param date
	 * @param units
	 * @param reset - if true, then all lower units will be reset to zero
	 */
	set(date: Date, units: DateSetParams, reset?: boolean): Date;

	/**
	 * Returns a curried version of `Date.rewind`
	 *
	 * @param units
	 * @param reset - if true, then all lower units will be reset to zero
	 */
	rewind(units: DateSetParams, reset?: boolean): (date: Date) => Date;

	/**
	 * Modifies the date with subtracting time units
	 *
	 * @param date
	 * @param units
	 * @param reset - if true, then all lower units will be reset to zero
	 */
	rewind(date: Date, units: DateSetParams, reset?: boolean): Date;

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
