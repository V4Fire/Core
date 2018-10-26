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
 * Returns values only for string fields. For converting enums
 * @param names
 */
export function convertEnumToDict(names: Dictionary): Record<string, string> {
	return $C(names).filter((el) => !isNaN(Number(el))).map((value, key) => key);
}
