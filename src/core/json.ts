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
 * Reviver for JSON.parse: converts date string to Date
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

/**
 * Sets .toJSON function that converts dates to UTC for all dates from the specified object
 *
 * @param obj
 * @param [clone] - if true, then will be created new object
 */
export function setJSONToUTC<T = unknown>(obj: T, clone?: boolean): T {
	if (!clone) {
		obj = Object.fastClone(obj);
	}

	Object.forEach(obj, (el) => {
		if (Object.isDate(el)) {
			el.toJSON = () => el.clone().set({
				minutes: el.getTimezoneOffset(),
				seconds: 0,
				milliseconds: 0
			}).valueOf().toString();

		} else if (Object.isObject(el) || Object.isArray(el)) {
			setJSONToUTC(el, true);
		}
	});

	return obj;
}
