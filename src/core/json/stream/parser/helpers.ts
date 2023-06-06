/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Returns a symbol from the passed HEX char string
 *
 * @param str
 *
 * @example
 * ```
 * // '😀'
 * console.log(fromHex('0x1f600'));
 * ```
 */
export function fromHex(str: string): string {
	return String.fromCodePoint(parseInt(str.slice(2), 16));
}
