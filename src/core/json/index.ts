/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/json/README.md]]
 * @packageDocumentation
 */

import { isDateStr } from 'core/prelude/date/const';

const
	minDateLength = '2017-02-03'.length;

/**
 * Reviver for the `JSON.parse` method: converts all strings that are looks like a date to Date
 *
 * @param key
 * @param value
 *
 * @example
 * ```js
 * JSON.parse('"2015-10-12"', convertIfDate) instanceof Date // true
 * ```
 */
export function convertIfDate(key: string, value: unknown): unknown {
	if (Object.isString(value) && value.length >= minDateLength && RegExp.test(isDateStr, value)) {
		const date = Date.create(value);
		return isNaN(date.valueOf()) ? value : date;
	}

	return value;
}
