/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface RegExp {
	/**
	 * Returns a new RegExp based on the source with adding the specified flags
	 * @param flags
	 */
	addFlags(...flags: RegExpFlag[]): RegExp;

	/**
	 * Returns a new RegExp based on the source with removing the specified flags
	 * @param flags
	 */
	removeFlags(...flags: RegExpFlag[]): RegExp;

	/**
	 * Returns a new RegExp based on the source with setting the specified flags
	 * @param flags
	 */
	setFlags(...flags: RegExpFlag[]): RegExp;
}
