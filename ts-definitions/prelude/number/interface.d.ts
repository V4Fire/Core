/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

type NumberOption =
	'decimal' |
	'thousands';

interface NumberPadOptions {
	/**
	 * Length of the resulting string once the current string has been padded
	 */
	length?: number;

	/**
	 * Value of the base to convert in a string
	 * @default `10`
	 */
	base?: number;

	/**
	 * If true, then a sign of the number will be written anyway
	 * @default `false`
	 */
	sign?: boolean;
}
