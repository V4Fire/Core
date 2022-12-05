/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Returns true if the specified value can be used as an index within an array
 *
 * @param value
 */
export function isValueCanBeArrayIndex(value: unknown): boolean {
	if (Object.isString(value) && String(Number(value)) === value) {
		value = Number(value);
	}

	if (Object.isNumber(value)) {
		const maxArrayIndex = 2 ** 32 - 1;
		return Number.isInteger(value) && Number.isNonNegative(value) && value <= maxArrayIndex;
	}

	return false;
}
