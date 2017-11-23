/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
import { lang } from 'core/i18n';

/**
 * Returns a value without translation instead the standard i18n behaviour
 * @param value
 */
export function noi18n(value: string): string {
	return value;
}

/**
 * Returns true if the specified value is empty
 * @param value
 */
export function isEmptyValue(value: any): boolean {
	return !value;
}

/**
 * Sets .toJSON function that converts dates to UTC for all dates from the specified object
 * (returns new object)
 *
 * @param obj
 * @param [sys]
 */
export function setJSONToUTC(obj: Record<string, any>, sys?: boolean): Record<string, any> {
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

/**
 * Returns a date range by the specified parameters
 *
 * @param from
 * @param [to]
 */
export function getDateRange(from: string | number | Date, to: string | number | Date = from): Date[] {
	return [
		Date.create(from).beginningOfDay(),
		Date.create(to).endOfDay()
	];
}

type DateCreateOptions = sugarjs.Date.DateCreateOptions;

/**
 * Normalizes the specified value as date
 *
 * @param value
 * @param [params] - additional parameters for Date.create
 */
export function normalizeIfDate(value: any, params?: DateCreateOptions): Date | undefined;

/**
 * @param value - list of values
 * @param [params] - additional parameters for Date.create
 */
export function normalizeIfDate(value: any[], params?: DateCreateOptions): Date[];

// tslint:disable-next-line
export function normalizeIfDate(value, params) {
	if (Object.isArray(value)) {
		return $C(value).map((date) => Date.create(date, params));
	}

	return value ? Date.create(value, params) : undefined;
}

/**
 * Returns date value from the specified string
 *
 * @param str
 * @param [separator] - separator pattern
 * @param [params] - additional parameters for Date.create
 */
export function getDateFromStr(str: string, separator: RegExp = /\/|-|\.|\s+/, params?: DateCreateOptions): Date {
	const p = str.split(separator);
	return Date.create(lang === 'ru' ? [p[1], p[0], p[2]].join('.') : str, params);
}

/**
 * Returns formatted time string from the specified time array
 * @param time
 */
export function getTimeFormattedStr(time: number[]): string {
	return $C(time).map((el) => el.pad(2)).join(':');
}
