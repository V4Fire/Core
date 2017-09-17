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
 * Simplifies the specified list data to a single value (map)
 * @param list
 */
export function simplifyListToMap(list: HashTable<any>): HashTable<any> {
	return list && (list.data && list.data[0] || list[0]) || {};
}

/**
 * Sets .toJSON function that converts dates to UTC for all dates from the specified object
 * (returns new object)
 *
 * @param obj
 * @param [sys]
 */
export function setJSONToUTC(obj: HashTable<any>, sys?: boolean): HashTable<any> {
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

export function normalizeDate(value: any, params?: HashTable<any>): Date | undefined;
export function normalizeDate(value: any[], params?: HashTable<any>): Date[];

/**
 * Normalizes the specified value as date
 *
 * @param value
 * @param [params] - additional parameters for Date.create
 */
export function normalizeDate(value, params) {
	if (Object.isArray(value)) {
		return $C(value).map((date) => Date.create(date, params));
	}

	return value ? Date.create(value, params) : undefined;
}

/**
 * Returns date value from the specified value
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
export function getTimeFormattedValue(time: number[]): string {
	return $C(time).map((el) => el.pad(2)).join(':');
}
