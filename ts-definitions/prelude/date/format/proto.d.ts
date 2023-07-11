/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface Date {
	/**
	 * Returns a short string representation of the date.
	 * This method is based on the native Intl API.
	 *
	 * @param [locale] - locale for internalizing
	 *
	 * @example
	 * ```js
	 * new Date('12/28/2019').short('en-us') // '12/28/2019'
	 * ```
	 */
	short(locale?: CanArray<string>): string;

	/**
	 * Returns a medium string representation of the date.
	 * This method is based on the native Intl API.
	 *
	 * @param [locale] - locale for internalizing
	 *
	 * @example
	 * ```js
	 * new Date('12/28/2019').medium('en-us') // 'December 28, 2019'
	 * ```
	 */
	medium(locale?: CanArray<string>): string;

	/**
	 * Returns a long string representation of the date.
	 * This method is based on the native Intl API.
	 *
	 * @param [locale] - locale for internalizing
	 *
	 * @example
	 * ```js
	 * new Date('12/28/2019').long('en-us') // '12/28/2019, 12:00:00 A'
	 * ```
	 */
	long(locale?: CanArray<string>): string;

	/**
	 * Returns a string representation of the date by the specified pattern.
	 * All pattern directives are based on the native `Intl.DateTimeFormat` options:
	 *
	 *   1. `'era'`
	 *   1. `'year'`
	 *   1. `'month'`
	 *   1. `'day'`
	 *   1. `'weekday'`
	 *   1. `'hour'`
	 *   1. `'minute'`
	 *   1. `'second'`
	 *   1. `'timeZoneName'`
	 *
	 * There are aliases for all directives:
	 *
	 *   1. `'e'` - era
	 *   1. `'Y'` - year
	 *   1. `'M'` - month
	 *   1. `'d'` - day
	 *   1. `'w'` - weekday
	 *   1. `'h'` - hour
	 *   1. `'m'` - minute
	 *   1. `'s'` - second
	 *   1. `'z'` - timeZoneName
	 *
	 * Also, some directives support optional use.
	 * To mark a directive as optional, add the special `?` character after the name or alias.
	 *
	 * ```js
	 * // Will be shown only the day value,
	 * // because the rest values are equal with `Date.now()`
	 * new Date().format('year?;month?:short;day', 'en-us');
	 *
	 * // Will be shown all values that are declared in the pattern
	 * new Date('12/28/2019').format('year?:2-digit;month?;day', 'en-us');
	 * ```
	 *
	 * @param pattern - string pattern of the format:
	 *
	 *   1. symbol `';'` is used as a separator character for pattern directives, for example: `'year;month'`
	 *   1. symbol `':'` is used for specifying a custom value for a pattern directive, for example:
	 *    `'year:2-digit;month:short'`
	 *
	 * @param [locale] - locale for internalizing
	 *
	 * @example
	 * ```js
	 * new Date('12/28/2019').format('year', 'en-us') // '2019'
	 * new Date('12/28/2019').format('year:2-digit', 'en-us') // '19'
	 * new Date('12/28/2019').format('year:2-digit;month', 'en-us') // 'Dec 19'
	 *
	 * // Formatting a date by using short aliases
	 * new Date('12/28/2019').format('Y:2-digit;M:long;d', 'en-us') // 'December 28, 19'
	 * ```
	 */
	format(pattern: string, locale?: CanArray<string>): string;

	/**
	 * Returns a string representation of the date by the specified options
	 *
	 * @param opts - formatting options
	 * @param [locale] - locale for internalizing
	 */
	format(opts: Intl.DateTimeFormatOptions, locale?: CanArray<string>): string;

	/**
	 * Returns an HTML string representation of the date (without time).
	 * This method is useful for providing date values within HTML tag attributes.
	 *
	 * @param [opts] - additional options
	 */
	toHTMLDateString(opts?: DateHTMLDateStringOptions): string;

	/**
	 * Returns an HTML string representation of a timestamp from the date.
	 * This method is useful for providing timestamp values within HTML tag attributes.
	 *
	 * @param [opts] - additional options
	 */
	toHTMLTimeString(opts?: DateHTMLTimeStringOptions): string;

	/**
	 * Returns an HTML string representation of a datetime from the date.
	 * This method is useful for providing datetime values within HTML tag attributes.
	 *
	 * @param [opts] - additional options
	 */
	toHTMLString(opts?: DateHTMLStringOptions): string;
}
