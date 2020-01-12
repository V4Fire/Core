/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Returns true if the specified value is empty
 * @param value
 */
export function isEmptyValue(value: unknown): boolean {
	return !value;
}

/**
 * Returns a value without internalizing instead the standard i18n behaviour
 * @param value
 */
export function noi18n(value: string): string {
	return value;
}
