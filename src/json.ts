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
 * Reviver for JSON.parse: converts a date string to Date
 *
 * @param key
 * @param val
 */
export function convertIfDate(key: string, val: any): any {
	if (Object.isString(val) && (val.length > minDateLength) && isDate.test(val)) {
		const utc = Date.parse(val);
		val = isNaN(utc) ? val : new Date(utc);
	}

	return val;
}
