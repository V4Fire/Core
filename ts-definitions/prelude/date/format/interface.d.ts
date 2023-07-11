/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface DateHTMLDateStringOptions {
	/**
	 * If false, then a date month is taken from the beginning of the now year
	 * @default `true`
	 */
	month?: boolean;

	/**
	 * If false, then a date day is taken from the beginning of the now month
	 * @default `true`
	 */
	date?: boolean;
}

interface DateHTMLTimeStringOptions {
	/**
	 * If false, then a date month is taken from the beginning of the now hour
	 * @default `true`
	 */
	minutes?: boolean;

	/**
	 * If false, then a date second is taken from the beginning of the now minute
	 * @default `true`
	 */
	seconds?: boolean;

	/**
	 * If false, then a date millisecond is taken from the beginning of the now second
	 * @default `true`
	 */
	milliseconds?: boolean;
}

type DateHTMLStringOptions =
	DateHTMLTimeStringOptions &
	DateHTMLDateStringOptions;
