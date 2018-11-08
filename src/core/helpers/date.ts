/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');

import { lang } from 'core/i18n';
import { DateValue, DateCreateOptions } from 'core/date';

/**
 * Normalizes the specified value as date
 *
 * @param value
 * @param [params] - additional parameters for Date.create
 */
export function normalizeIfDate(value: unknown, params?: DateCreateOptions): CanUndef<Date>;

/**
 * @param value - list of values
 * @param [params] - additional parameters for Date.create
 */
export function normalizeIfDate(value: unknown[], params?: DateCreateOptions): Date[];
export function normalizeIfDate(value: CanArray<unknown>, params?: DateCreateOptions): CanUndef<CanArray<Date>> {
	const
		f = (v) => Object.isString(v) || Object.isNumber(v) || Object.isDate(v);

	if (Object.isArray(value)) {
		return $C(value).filter(f).map((date) => Date.create(<DateValue>date, params));
	}

	if (f(value)) {
		return Date.create(<DateValue>value, params);
	}

	return undefined;
}

const
	separatorRgxp = /\/|-|\.|\s+/;

/**
 * Returns date value from the specified string
 *
 * @param str
 * @param [separator] - separator pattern
 * @param [params] - additional parameters for Date.create
 */
export function getDateFromStr(str: string, separator: RegExp = separatorRgxp, params?: DateCreateOptions): Date {
	const p = str.split(separator);
	return Date.create(lang === 'ru' ? [p[1], p[0], p[2]].join('.') : str, params);
}
