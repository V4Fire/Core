/* eslint-disable @typescript-eslint/unified-signatures */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface NumberConstructor {
	/**
	 * Returns an option value by the specified key
	 *
	 * @deprecated
	 * @param key
	 */
	getOption(key: NumberOption): string;

	/**
	 * Sets a new option value by the specified key
	 *
	 * @deprecated
	 * @param key
	 * @param value
	 */
	setOption(key: NumberOption, value: string): string;

	/**
	 * Returns true if the specified value is a safe number
	 * @param value
	 */
	isSafe(value: any): boolean;

	/**
	 * Returns true if the specified value is an integer number
	 * @param value
	 */
	isInteger(value: any): boolean;

	/**
	 * Returns true if the specified value is a float number
	 * @param value
	 */
	isFloat(value: any): boolean;

	/**
	 * Returns true if the specified value is an even number
	 * @param value
	 */
	isEven(value: any): boolean;

	/**
	 * Returns true if the specified value is an odd number
	 * @param value
	 */
	isOdd(value: any): boolean;

	/**
	 * Returns true if the specified value is a natural number
	 * @param value
	 */
	isNatural(value: any): boolean;

	/**
	 * Returns true if the specified value is a positive number
	 * @param value
	 */
	isPositive(value: any): boolean;

	/**
	 * Returns true if the specified value is a negative number
	 * @param value
	 */
	isNegative(value: any): boolean;

	/**
	 * Returns true if the specified value is a non-negative number
	 * @param value
	 */
	isNonNegative(value: any): boolean;

	/**
	 * Returns true if the specified value is a number and is more or equal than 0 and less or equal than 1
	 * @param value
	 */
	isBetweenZeroAndOne(value: any): boolean;

	/**
	 * Returns true if the specified value is a number and is more than 0 and less or equal than 1
	 * @param value
	 */
	isPositiveBetweenZeroAndOne(value: any): boolean;

	/**
	 * Returns a value of milliseconds from the seconds
	 */
	seconds(value: number): number;

	/**
	 * Returns a value of milliseconds from the minutes
	 */
	minutes(value: number): number;

	/**
	 * Returns a value of milliseconds from the hours
	 */
	hours(value: number): number;

	/**
	 * Returns a value of milliseconds from the days
	 */
	days(value: number): number;

	/**
	 * Returns a value of milliseconds from the weeks
	 */
	weeks(value: number): number;

	/**
	 * Returns a curried version of `Number.floor`
	 * @param precision
	 */
	floor(precision: number): (value: number) => number;

	/**
	 * Shortcut for Math.floor that also allows a precision
	 *
	 * @param value
	 * @param precision
	 */
	floor(value: number, precision: number): number;

	/**
	 * Returns a curried version of `Number.round`
	 * @param precision
	 */
	round(precision: number): (value: number) => number;

	/**
	 * Shortcut for Math.round that also allows a precision
	 *
	 * @param value
	 * @param precision
	 */
	round(value: number, precision: number): number;

	/**
	 * Returns a curried version of `Number.ceil`
	 * @param precision
	 */
	ceil(precision: number): (value: number) => number;

	/**
	 * Shortcut for Math.ceil that also allows a precision
	 *
	 * @param value
	 * @param precision
	 */
	ceil(value: number, precision: number): number;

	/**
	 * Returns a curried version of `Number.pad`
	 * @param opts - additional options
	 */
	pad(opts: NumberPadOptions): (value: string) => string;

	/**
	 * Returns a string from a number with adding extra zeros to the start, if necessary
	 *
	 * @param num
	 * @param targetLength - length of the resulting string once the current string has been padded
	 */
	pad(num: number, targetLength?: number): string;

	/**
	 * Returns a string from a number with adding extra zeros to the start, if necessary
	 *
	 * @param num
	 * @param opts - additional options
	 */
	pad(num: number, opts: NumberPadOptions): string;

	/**
	 * Returns a curried version of `Number.format`
	 *
	 * @param pattern
	 * @param locale
	 */
	format(pattern: string, locale?: CanArray<string>): (value: number) => string;

	/**
	 * Returns a curried version of `Number.format`
	 *
	 * @param opts
	 * @param locale
	 */
	format(opts: Intl.NumberFormatOptions, locale?: CanArray<string>): (value: number) => string;

	/**
	 * Returns a string representation of a number by the specified pattern.
	 * All pattern directives are based on the native `Intl.NumberFormat` options:
	 *
	 *   1. `'style'`
	 *   2. `'currency'`
	 *   3. `'currencyDisplay'`
	 *
	 * There are aliases for all directives:
	 *
	 *   1. `'$'` - `{style: 'currency', currency: 'USD'}`
	 *   2. `'$:${currency}'` - `{style: 'currency', currency}`
	 *   3. `'$d:${currencyDisplay}'` - `{currencyDisplay}`
	 *   4. `'%'` - `{style: 'percent'}`
	 *   5. `'.'` - `{style: 'decimal'}`
	 *
	 * @param num
	 * @param pattern - format string pattern:
	 *   1. symbol `';'` is used as a separator character for the pattern directives, for example: `'$;$d:code'`
	 *   2. symbol `':'` is used for specifying a custom value for a pattern directive, for example:
	 *    `'$:RUB;$d:code'`
	 *
	 * @param [locale] - locale for internalizing
	 *
	 * @example
	 * ```js
	 *  100.50.format('$', 'en-us') // '$100.50'
	 *  100.50.format('$:EUR;$d:code', 'en-us') // 'EUR 100.50'
	 * ```
	 */
	format(num: number, pattern?: string, locale?: CanArray<string>): string;

	/**
	 * Returns a string representation of a number by the specified options
	 *
	 * @param num
	 * @param opts - formatting options
	 * @param [locale] - locale for internalizing
	 */
	format(num: number, opts: Intl.NumberFormatOptions, locale?: CanArray<string>): string;
}
