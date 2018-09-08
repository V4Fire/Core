/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Prints the specified parameters to a console
 *
 * @param key - log key
 * @param [details]
 */
export default function log(key: string, ...details: any[]): void {
	console.log(`[[${key}]]:`, ...details);
}
