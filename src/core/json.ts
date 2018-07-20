/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');

const
	minDateLength = '2017-02-03T'.length,
	isDate = /^\d{4}-\d{2}-\d{2}T[\d:.]+Z/;

/**
 * Reviver for JSON.parse: converts date string to Date
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

/**
 * Sets .toJSON function that converts dates to UTC for all dates from the specified object
 * (returns new object)
 *
 * @param obj
 * @param [sys]
 */
export function setJSONToUTC(obj: Dictionary, sys?: boolean): Dictionary {
	if (!sys) {
		obj = Object.fastClone(obj);
	}

	$C(obj).forEach((el) => {
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
