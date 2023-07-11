/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface StringCapitalizeOptions {
	/**
	 * If true, then remainder of the string will be transformed to lower case
	 * @default `false`
	 */
	lower?: boolean;

	/**
	 * If true, all words in the string will be capitalized
	 * @default `false`
	 */
	all?: boolean;

	/**
	 * If false, then the operation isn't cached
	 * @default `true`
	 */
	cache?: boolean;
}

interface StringCamelizeOptions {
	/**
	 * If false, then the first character of the string will be transformed to the lower case
	 * @default `true`
	 */
	upper?: boolean;

	/**
	 * If false, then the result string won't be cached
	 * @default `true`
	 */
	cache?: boolean;
}

interface StringDasherizeOptions {
	/**
	 * If true, then the operation can be reverted
	 * @default `false`
	 */
	stable?: boolean;

	/**
	 * If false, then the operation isn't cached
	 * @default `true`
	 */
	cache?: boolean;
}

interface StringUnderscoreOptions extends StringDasherizeOptions {

}
