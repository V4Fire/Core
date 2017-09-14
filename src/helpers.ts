'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { lang } from './i18n';

const
	$C = require('collection.js');

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
 * Simplifies the specified list to a single value (map)
 * @param list
 */
export function list2Map(list: Object): Object {
	return list && (list.data && list.data[0] || list[0]) || {};
}

/**
 * Returns a value from an object by the specified language
 *
 * @param obj
 * @param lang
 * @param defLang - hotel language
 */
export function getLangValue(obj: ?Object, lang: string, defLang: string): ?string {
	if (!obj) {
		return undefined;
	}

	return lang in obj ? obj[lang] : obj[defLang] || obj[Object.keys(obj)[0]];
}

/**
 * Sets .toJSON function that converts dates to UTC for all dates from the specified object
 * (returns new object)
 *
 * @param obj
 * @param [sys]
 */
export function setJSONToUTC(obj: Object, sys?: boolean): Object {
	if (!sys) {
		obj = Object.fastClone(obj);
	}

	$C(obj).forEach((el) => {
		if (Object.isDate(el)) {
			el.toJSON = () => el.clone().set({
				minutes: el.getTimezoneOffset(),
				seconds: 0,
				milliseconds: 0
			}).valueOf();

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
 * @param to
 */
export function getDateRange(from: string | number | Date, to?: string | number | Date = from): Array<Date> {
	return [
		Date.create(from).beginningOfDay(),
		Date.create(to).endOfDay()
	];
}

/**
 * Normalizes the specified value as date
 *
 * @param value
 * @param [params] - additional parameters for Date.create
 */
export function normalizeDate(value: Array | any, params?: Object): ?Date | Array<Date> {
	if (Object.isArray(value)) {
		return $C(value).map((date) => Date.create(date, params));
	}

	return value ? Date.create(value, params) : undefined;
}

/**
 * Returns date value from the specified
 * @param value
 */
export function getDateFromInput(value: string): Date {
	const p = value.split(/\/|-|\.|\s+/);
	return Date.create(lang === 'ru' ? [p[1], p[0], p[2]].join('.') : value);
}

/**
 * Returns formatted time value
 * @param time
 */
export function getTimeFormattedValue(time: Array<number>): string {
	return $C(time).map((el) => el.pad(2)).join(':');
}
