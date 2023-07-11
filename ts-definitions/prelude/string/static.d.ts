/* eslint-disable @typescript-eslint/unified-signatures */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface StringConstructor {
	/**
	 * Returns an iterator over the string letters.
	 * The method understands the composition of multiple Unicode symbols that produce one visual symbol.
	 *
	 * @example
	 * ```
	 * [...String.letters('12🇷🇺👩')] // ['1', '2', '🇷🇺', '👩']
	 * ```
	 */
	letters(str: string): IterableIterator<string>;

	/**
	 * Returns a curried version of `String.capitalize`
	 * @param opts - additional options
	 */
	capitalize(opts: StringCapitalizeOptions): (str: string) => string;

	/**
	 * Capitalizes the first character of the string and returns it
	 *
	 * @param str
	 * @param [opts] - additional options
	 */
	capitalize(str: string, opts?: StringCapitalizeOptions): string;

	/**
	 * Returns a curried version of `String.camelize`
	 * @param upper - if false, then the first character of a value is transformed to the lower case
	 */
	camelize(upper: boolean): (str: string) => string;

	/**
	 * Returns a curried version of `String.camelize`
	 * @param opts - additional options
	 */
	camelize(opts: StringCamelizeOptions): (str: string) => string;

	/**
	 * Returns a CamelCaseStyle version of the specified string
	 *
	 * @param str
	 * @param [upper] - if false, then the first character of a value is transformed to the lower case
	 */
	camelize(str: string, upper?: boolean): string;

	/**
	 * Returns a CamelCaseStyle version of the specified string
	 *
	 * @param str
	 * @param [opts] - additional options
	 */
	camelize(str: string, opts?: StringCamelizeOptions): string;

	/**
	 * Returns a curried version of `String.dasherize`
	 * @param stable - if true, then the operation can be reverted
	 */
	dasherize(stable: boolean): (str: string) => string;

	/**
	 * Returns a curried version of `String.dasherize`
	 * @param opts - additional options
	 */
	dasherize(opts: StringDasherizeOptions): (str: string) => string;

	/**
	 * Returns a dash-style version of the specified string
	 *
	 * @param str
	 * @param [stable] - if true, then the operation can be reverted
	 */
	dasherize(str: string, stable?: boolean): string;

	/**
	 * Returns a dash-style version of the specified string
	 *
	 * @param str
	 * @param [opts] - additional options
	 */
	dasherize(str: string, opts?: StringDasherizeOptions): string;

	/**
	 * Returns a curried version of `String.underscore`
	 * @param stable - if true, then the operation can be reverted
	 */
	underscore(stable: boolean): (str: string) => string;

	/**
	 * Returns a curried version of `String.underscore`
	 * @param opts - additional options
	 */
	underscore(opts: StringUnderscoreOptions): (str: string) => string;

	/**
	 * Returns an underscore_style version of the specified string
	 *
	 * @param str
	 * @param [stable] - if true, then the operation can be reverted
	 */
	underscore(str: string, stable?: boolean): string;

	/**
	 * Returns an underscore_style version of the specified string
	 *
	 * @param str
	 * @param [opts] - additional options
	 */
	underscore(str: string, opts?: StringUnderscoreOptions): string;
}
