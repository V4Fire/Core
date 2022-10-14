/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

import {

	isDateStr,
	isFloatStr,

	normalizeDateChunkRgxp,
	normalizeZoneRgxp,

	createAliases

} from 'core/prelude/date/const';

import { isTruly, isString, isNumber } from 'core/prelude/types';

import { parse } from 'core/prelude/object/convert';

/** @see [[Date.clone]] */
export const clone = extend(Date.prototype, 'clone', function clone(this: Date): Date {
	return new Date(this);
});

/** @see [[DateConstructor.create]] */
export const create = extend<typeof Date.create>(Date, 'create', (pattern?: DateCreateValue) => {
	if (pattern == null || pattern === '') {
		return new Date();
	}

	if (pattern instanceof Date) {
		return new Date(pattern);
	}

	if (isString(pattern)) {
		if (pattern in createAliases) {
			return createAliases[pattern]();
		}

		if (!isDateStr.test(pattern)) {
			return new Date(pattern);
		}

		const getZone = (normalizedDate) => {
			const
				zone = new Date(normalizedDate).getTimezoneOffset(),
				h = Math.floor(Math.abs(zone) / 60),
				m = Math.abs(zone) - (h * 60);

			return `${zone <= 0 ? '+' : '-'}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
		};

		const normalizeZone = (zone) => {
			if (RegExp.test(normalizeZoneRgxp, zone)) {
				return `${zone.substr(0, 3)}:${zone.substr(3)}`;
			}

			return zone;
		};

		const normalizeDate = (date) => {
			const
				chunks = normalizeDateChunkRgxp.exec(date);

			if (chunks == null) {
				return date;
			}

			const
				year = chunks[1].length === 4 ? chunks[1] : chunks[3],
				day = chunks[1].length === 4 ? chunks[3] : chunks[1];

			return `${year}-${chunks[2].padStart(2, '0')}-${day.padStart(2, '0')}`;
		};

		const replacer = (str, date, time, zone) => {
			const
				normalizedDate = normalizeDate(date);

			time = isTruly(time) ? time : '00:00:00';
			zone = isTruly(zone) ? zone : getZone(normalizedDate);

			return `${normalizedDate}T${time}${normalizeZone(zone)}`;
		};

		return new Date(parse(pattern.replace(isDateStr, replacer)));
	}

	if (isString(pattern) && isFloatStr.test(pattern)) {
		const float = parseFloat(pattern);
		pattern = float > 0 ? float * 1e3 : pattern;

	} else if (isNumber(pattern) && !pattern.isInteger()) {
		pattern *= 1e3;
	}

	return new Date(pattern.valueOf());
});

/** @see [[Date.beginningOfDay]] */
export const beginningOfDay = extend(Date.prototype, 'beginningOfDay', function beginningOfDay(this: Date): Date {
	const date = this.clone();
	date.setHours(0, 0, 0, 0);
	return date;
});

/** @see [[Date.endOfDay]] */
export const endOfDay = extend(Date.prototype, 'endOfDay', function endOfDay(this: Date): Date {
	const date = this.clone();
	date.setHours(23, 59, 59, 999);
	return date;
});

/** @see [[Date.beginningOfWeek]] */
export const beginningOfWeek = extend(Date.prototype, 'beginningOfWeek', function beginningOfWeek(this: Date): Date {
	const date = this.clone();
	date.setDate(this.getDate() - this.getDay());
	return date.beginningOfDay();
});

/** @see [[Date.endOfWeek]] */
export const endOfWeek = extend(Date.prototype, 'endOfWeek', function endOfWeek(this: Date): Date {
	const date = this.clone();
	date.setDate(this.getDate() + 6 - this.getDay());
	return date.endOfDay();
});

/** @see [[Date.beginningOfMonth]] */
export const beginningOfMonth = extend(Date.prototype, 'beginningOfMonth', function beginningOfMonth(this: Date): Date {
	const date = this.clone();
	date.setDate(1);
	return date.beginningOfDay();
});

/** @see [[Date.endOfMonth]] */
export const endOfMonth = extend(Date.prototype, 'endOfMonth', function endOfMonth(this: Date): Date {
	const date = this.clone();
	date.setMonth(this.getMonth() + 1, 0);
	return date.endOfDay();
});

/** @see [[Date.daysInMonth]] */
export const daysInMonth = extend(Date.prototype, 'daysInMonth', function daysInMonth(this: Date): number {
	return this.clone().endOfMonth().getDate();
});

/** @see [[Date.beginningOfYear]] */
export const beginningOfYear = extend(Date.prototype, 'beginningOfYear', function beginningOfYear(this: Date): Date {
	const date = this.clone();
	date.setMonth(0, 1);
	return date.beginningOfDay();
});

/** @see [[Date.endOfYear]] */
export const endOfYear = extend(Date.prototype, 'endOfYear', function endOfYear(this: Date): Date {
	const date = this.clone();
	date.setMonth(12, 0);
	return date.endOfDay();
});

//#if standalone_prelude
/** @see [[DateConstructor.endOfYear]] */
extend(Date, 'endOfYear', (date: Date) => date.endOfYear());

/** @see [[DateConstructor.beginningOfYear]] */
extend(Date, 'beginningOfYear', (date: Date) => date.beginningOfYear());

/** @see [[DateConstructor.daysInMonth]] */
extend(Date, 'daysInMonth', (date: Date) => date.daysInMonth());

/** @see [[DateConstructor.endOfMonth]] */
extend(Date, 'endOfMonth', (date: Date) => date.endOfMonth());

/** @see [[DateConstructor.beginningOfMonth]] */
extend(Date, 'beginningOfMonth', (date: Date) => date.beginningOfMonth());

/** @see [[DateConstructor.endOfWeek]] */
extend(Date, 'endOfWeek', (date: Date) => date.endOfWeek());

/** @see [[DateConstructor.beginningOfWeek]] */
extend(Date, 'beginningOfWeek', (date: Date) => date.beginningOfWeek());

/** @see [[DateConstructor.endOfDay]] */
extend(Date, 'endOfDay', (date: Date) => date.endOfDay());

/** @see [[DateConstructor.beginningOfDay]] */
extend(Date, 'beginningOfDay', (date: Date) => date.beginningOfDay());
//#endif
