/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface RegExpConstructor {
	/**
	 * Returns the specified value as a string with escaping of all RegExp specific characters
	 * @param value
	 */
	escape(value: string): string;

	/**
	 * Returns true if the specified string is matched with a RegExp.
	 * If the RegExp has the global flag, it will be ignored.
	 *
	 * @param rgxp
	 * @param str
	 */
	test(rgxp: RegExp, str: string): boolean;

	/**
	 * Returns a curried version of `RegExp.test`
	 * @param rgxp
	 */
	test(rgxp: RegExp): (str: string) => boolean;

	/**
	 * Returns a curried version of `inverted` `RegExp.test`
	 * @param str
	 */
	test(str: string): (rgxp: RegExp) => boolean;

	/**
	 * Returns a new RegExp based on the source with adding the specified flags
	 *
	 * @param rgxp
	 * @param flags
	 */
	addFlags(rgxp: RegExp, ...flags: RegExpFlag[]): RegExp;

	/**
	 * Returns a curried version of `RegExp.addFlags`
	 * @param rgxp
	 */
	addFlags(rgxp: RegExp): (...flags: RegExpFlag[]) => RegExp;

	/**
	 * Returns a curried version of `inverted` RegExp.addFlags
	 * @param flags
	 */
	addFlags(flags: RegExpFlag): (rgxp: RegExp) => RegExp;

	/**
	 * Returns a new RegExp based on the source with removing the specified flags
	 *
	 * @param rgxp
	 * @param flags
	 */
	removeFlags(rgxp: RegExp, ...flags: RegExpFlag[]): RegExp;

	/**
	 * Returns a curried version of `RegExp.removeFlags`
	 * @param rgxp
	 */
	removeFlags(rgxp: RegExp): (...flags: RegExpFlag[]) => RegExp;

	/**
	 * Returns a curried version of `inverted` RegExp.removeFlags
	 * @param flags
	 */
	removeFlags(flags: RegExpFlag): (rgxp: RegExp) => RegExp;

	/**
	 * Returns a new RegExp based on the source with setting the specified flags
	 *
	 * @param rgxp
	 * @param flags
	 */
	setFlags(rgxp: RegExp, ...flags: RegExpFlag[]): RegExp;

	/**
	 * Returns a curried version of `RegExp.setFlags`
	 * @param rgxp
	 */
	setFlags(rgxp: RegExp): (...flags: RegExpFlag[]) => RegExp;

	/**
	 * Returns a curried version of `inverted` RegExp.setFlags
	 * @param flags
	 */
	setFlags(flags: RegExpFlag): (rgxp: RegExp) => RegExp;
}
