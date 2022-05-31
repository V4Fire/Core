/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface Number {
	/**
	 * Returns a string: the value + 'em'
	 */
	em: string;

	/**
	 * Returns a string: the value + 'rem'
	 */
	rem: string;

	/**
	 * Returns a string: the value + 'px'
	 */
	px: string;

	/**
	 * Returns a string: the value + 'per'
	 */
	per: string;

	/**
	 * Returns a string: the value + 'vh'
	 */
	vh: string;

	/**
	 * Returns a string: the value + 'vw'
	 */
	vw: string;

	/**
	 * Returns a string: the value + 'vmin'
	 */
	vmin: string;

	/**
	 * Returns a string: the value + 'vmax'
	 */
	vmax: string;

	/**
	 * Returns a value of milliseconds from the seconds
	 */
	second(): number;

	/**
	 * Returns a value of milliseconds from the seconds
	 */
	seconds(): number;

	/**
	 * Returns a value of milliseconds from the minutes
	 */
	minute(): number;

	/**
	 * Returns a value of milliseconds from the minutes
	 */
	minutes(): number;

	/**
	 * Returns a value of milliseconds from the hours
	 */
	hour(): number;

	/**
	 * Returns a value of milliseconds from the hours
	 */
	hours(): number;

	/**
	 * Returns a value of milliseconds from the days
	 */
	day(): number;

	/**
	 * Returns a value of milliseconds from the days
	 */
	days(): number;

	/**
	 * Returns a value of milliseconds from the weeks
	 */
	week(): number;

	/**
	 * Returns a value of milliseconds from the weeks
	 */
	weeks(): number;

	/**
	 * Returns true if the number is safe
	 */
	isSafe(): boolean;

	/**
	 * Returns true if the number is an integer
	 */
	isInteger(): boolean;

	/**
	 * Returns true if the number is a float
	 */
	isFloat(): boolean;

	/**
	 * Returns true if the number is even
	 */
	isEven(): boolean;

	/**
	 * Returns true if the number is odd
	 */
	isOdd(): boolean;

	/**
	 * Returns true if the number is natural
	 */
	isNatural(): boolean;

	/**
	 * Returns true if the number is positive
	 */
	isPositive(): boolean;

	/**
	 * Returns true if the number is negative
	 */
	isNegative(): boolean;

	/**
	 * Returns true if the number is non-negative
	 */
	isNonNegative(): boolean;

	/**
	 * Returns true if the number is more or equal than 0 and less or equal than 1
	 */
	isBetweenZeroAndOne(): boolean;

	/**
	 * Returns true if the number is more than 0 and less or equal than 1
	 */
	isPositiveBetweenZeroAndOne(): boolean;

	/**
	 * Returns a string from the number with adding extra zeros to the start, if necessary
	 *
	 * @param targetLength - length of the resulting string once the current string has been padded
	 * @param [opts] - additional options
	 */
	pad(targetLength?: number, opts?: NumberPadOptions): string;

	/**
	 * Returns a string representation of the number by the specified pattern.
	 * All pattern directives are based on the native `Intl.NumberFormat` options:
	 *
	 *   1. `'style'`
	 *   1. `'currency'`
	 *   1. `'currencyDisplay'`
	 *
	 * There are aliases for all directives:
	 *
	 *   1. `'$'` - `{style: 'currency', currency: 'USD'}`
	 *   1. `'$:${currency}'` - `{style: 'currency', currency}`
	 *   1. `'$d:${currencyDisplay}'` - `{currencyDisplay}`
	 *   1. `'%'` - `{style: 'percent'}`
	 *   1. `'.'` - `{style: 'decimal'}`
	 *
	 * @param pattern - string pattern of the format:
	 *   1. symbol `';'` is used as a separator character for pattern directives, for example: `'$;$d:code'`
	 *   1. symbol `':'` is used for specifying a custom value for a pattern directive, for example:
	 *    `'$:RUB;$d:code'`
	 *
	 * @param [locale] - locale for internalizing
	 *
	 * @example
	 * ```js
	 * 100.50.format('$', 'en-us') // '$100.50'
	 * 100.50.format('$:EUR;$d:code', 'en-us') // 'EUR 100.50'
	 * ```
	 */
	format(pattern?: string, locale?: CanArray<string>): string;

	/**
	 * Returns a string representation of the number by the specified options
	 *
	 * @param opts - formatting options
	 * @param [locale] - locale for internalizing
	 */
	format(opts: Intl.NumberFormatOptions, locale?: CanArray<string>): string;

	/**
	 * Returns a string representation of the number with adding some extra formatting
	 *
	 * @deprecated
	 * @param [length] - length of the decimal part
	 */
	format(length: number): string;

	/**
	 * Shortcut for Math.floor that also allows a precision
	 * @param [precision]
	 */
	floor(precision?: number): number;

	/**
	 * Shortcut for Math.round that also allows a precision
	 * @param [precision]
	 */
	round(precision?: number): number;

	/**
	 * Shortcut for Math.ceil that also allows a precision
	 * @param [precision]
	 */
	ceil(precision?: number): number;
}
