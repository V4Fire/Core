/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

const
	minDateLength = '2017-02-03T'.length,
	isDate = /^\d{4}-\d{2}-\d{2}T[\d:.]+Z/;

/**
 * A reviver for the JSON.parse method: converts all strings which is looks like a date to the Date object
 *
 * @param key
 * @param value
 */
export function convertIfDate(key: string, value: unknown): unknown {
	if (Object.isString(value) && (value.length > minDateLength) && isDate.test(value)) {
		const utc = Date.parse(value);
		return isNaN(utc) ? value : new Date(utc);
	}

	return value;
}
