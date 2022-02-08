/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

// Long hexadecimal codes: \uXXXX
export const fromHex = (s: string): string => String.fromCharCode(parseInt(s.slice(2), 16));
