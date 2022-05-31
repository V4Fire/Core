/* eslint-disable @typescript-eslint/unified-signatures */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface String {
	/**
	 * Returns an iterator over the string letters.
	 * The method understands the composition of multiple Unicode symbols that produce one visual symbol.
	 *
	 * @example
	 * ```
	 * [...'12🇷🇺👩'.letters()] // ['1', '2', '🇷🇺', '👩']
	 * ```
	 */
	letters(): IterableIterator<string>;

	/**
	 * Capitalizes the first character of a string and returns it
	 * @param [opts] - additional options
	 */
	capitalize(opts?: StringCapitalizeOptions): string;

	/**
	 * Returns a CamelCaseStyle version of the specified string
	 * @param [upper] - if false, then the first character of the string is transformed to the lower case
	 */
	camelize(upper?: boolean): string;

	/**
	 * Returns a CamelCaseStyle version of the specified string
	 * @param [opts] - additional options
	 */
	camelize(opts?: StringCamelizeOptions): string;

	/**
	 * Returns a dash-style version of the specified string
	 * @param [stable] - if true, then the operation can be reverted
	 */
	dasherize(stable?: boolean): string;

	/**
	 * Returns a dash-style version of the specified string
	 * @param [opts] - additional options
	 */
	dasherize(opts?: StringDasherizeOptions): string;

	/**
	 * Returns an underscore_style version of the specified string
	 * @param [stable] - if true, then the operation can be reverted
	 */
	underscore(stable?: boolean): string;

	/**
	 * Returns an underscore_style version of the specified string
	 * @param [opts] - additional options
	 */
	underscore(opts?: StringUnderscoreOptions): string;
}
