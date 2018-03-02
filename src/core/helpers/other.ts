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
export function isEmptyValue(value: any): boolean {
	return !value;
}

/**
 * Returns a value without translation instead the standard i18n behaviour
 * @param value
 */
export function noi18n(value: string): string {
	return value;
}

/**
 * Simplifies the specified list to a single value (map)
 * @param list
 */
export function list2Map(list: Dictionary): Dictionary {
	return list && (list.data && list.data[0] || list[0]) || {};
}
