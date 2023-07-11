/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface Date {
	/**
	 * Modifies the date with adding time units.
	 * The method mutates the original date.
	 *
	 * @param units
	 * @param reset - if true, then all lower units will be reset to zero
	 */
	add(units: DateSetParams, reset?: boolean): Date;

	/**
	 * Modifies the date with setting time units.
	 * The method mutates the original date.
	 *
	 * @param units
	 * @param reset - if true, then all lower units will be reset to zero
	 */
	set(units: DateSetParams, reset?: boolean): Date;

	/**
	 * Modifies the date with subtracting time units.
	 * The method mutates the original date.
	 *
	 * @param units
	 * @param reset - if true, then all lower units will be reset to zero
	 */
	rewind(units: DateSetParams, reset?: boolean): Date;
}
