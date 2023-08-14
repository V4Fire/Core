/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * Reviver for the `JSON.parse` method: converts all strings that are looks like a date to Date
 *
 * @param key
 * @param value
 *
 * @example
 * ```js
 * JSON.parse('"2015-10-12"', convertIfDate) instanceof Date // true
 * ```
 */
export declare function convertIfDate(key: string, value: unknown): unknown;
