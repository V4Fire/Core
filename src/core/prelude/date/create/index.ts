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

/** @see [[Date.clone]] */
extend(Date.prototype, 'clone', function clone(this: Date): Date {
	return new Date(this);
});

/** @see [[DateConstructor.create]] */
extend(Date, 'create', (pattern?: DateCreateValue) => {
	if (pattern == null || pattern === '') {
		return new Date();
	}

	if (pattern instanceof Date) {
		return new Date(pattern);
	}

	if (Object.isString(pattern)) {
		if (pattern in createAliases) {
			return createAliases[pattern]();
		}

		if (!isDateStr.test(pattern)) {
			return new Date(pattern);
		}

		const getZone = (normalizedDate) => {
			const zone = new Date(normalizedDate).getTimezoneOffset(),
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

			if (!chunks) {
				return date;
			}

			const
				year = chunks[1].length === 4 ? chunks[1] : chunks[3],
				day = chunks[1].length === 4 ? chunks[3] : chunks[1];

			return `${year}-${chunks[2].padStart(2, '0')}-${day.padStart(2, '0')}`;
		};

		const replacer = (str, date, time, zone) => {
			const normalizedDate = normalizeDate(date);

			time = Object.isTruly(time) ? time : '00:00:00';
			zone = Object.isTruly(zone) ? zone : getZone(normalizedDate);
			return `${normalizedDate}T${time}${normalizeZone(zone)}`;
		};

		return new Date(Date.parse(pattern.replace(isDateStr, replacer)));
	}

	if (Object.isString(pattern) && isFloatStr.test(pattern)) {
		const float = parseFloat(pattern);
		pattern = float > 0 ? float * 1e3 : pattern;

	} else if (Object.isNumber(pattern) && !pattern.isInteger()) {
		pattern *= 1e3;
	}

	return new Date(pattern.valueOf());
});

/** @see [[Date.beginningOfDay]] */
extend(Date.prototype, 'beginningOfDay', function beginningOfDay(this: Date): Date {
	const date = this.clone();
	date.setHours(0, 0, 0, 0);
	return date;
});

/** @see [[DateConstructor.beginningOfDay]] */
extend(Date, 'beginningOfDay', (date: Date) => date.beginningOfDay());

/** @see [[Date.endOfDay]] */
extend(Date.prototype, 'endOfDay', function endOfDay(this: Date): Date {
	const date = this.clone();
	date.setHours(23, 59, 59, 999);
	return date;
});

/** @see [[DateConstructor.endOfDay]] */
extend(Date, 'endOfDay', (date: Date) => date.endOfDay());

/** @see [[Date.beginningOfWeek]] */
extend(Date.prototype, 'beginningOfWeek', function beginningOfWeek(this: Date): Date {
	const date = this.clone();
	date.setDate(this.getDate() - this.getDay());
	return date.beginningOfDay();
});

/** @see [[DateConstructor.beginningOfWeek]] */
extend(Date, 'beginningOfWeek', (date: Date) => date.beginningOfWeek());

/** @see [[Date.endOfWeek]] */
extend(Date.prototype, 'endOfWeek', function endOfWeek(this: Date): Date {
	const date = this.clone();
	date.setDate(this.getDate() + 6 - this.getDay());
	return date.endOfDay();
});

/** @see [[DateConstructor.endOfWeek]] */
extend(Date, 'endOfWeek', (date: Date) => date.endOfWeek());

/** @see [[Date.beginningOfMonth]] */
extend(Date.prototype, 'beginningOfMonth', function beginningOfMonth(this: Date): Date {
	const date = this.clone();
	date.setDate(1);
	return date.beginningOfDay();
});

/** @see [[DateConstructor.beginningOfMonth]] */
extend(Date, 'beginningOfMonth', (date: Date) => date.beginningOfMonth());

/** @see [[Date.endOfMonth]] */
extend(Date.prototype, 'endOfMonth', function endOfMonth(this: Date): Date {
	const date = this.clone();
	date.setMonth(this.getMonth() + 1, 0);
	return date.endOfDay();
});

/** @see [[DateConstructor.endOfMonth]] */
extend(Date, 'endOfMonth', (date: Date) => date.endOfMonth());

/** @see [[Date.daysInMonth]] */
extend(Date.prototype, 'daysInMonth', function daysInMonth(this: Date): number {
	return this.clone().endOfMonth().getDate();
});

/** @see [[DateConstructor.daysInMonth]] */
extend(Date, 'daysInMonth', (date: Date) => date.daysInMonth());

/** @see [[Date.beginningOfYear]] */
extend(Date.prototype, 'beginningOfYear', function beginningOfYear(this: Date): Date {
	const date = this.clone();
	date.setMonth(0, 1);
	return date.beginningOfDay();
});

/** @see [[DateConstructor.beginningOfYear]] */
extend(Date, 'beginningOfYear', (date: Date) => date.beginningOfYear());

/** @see [[Date.endOfYear]] */
extend(Date.prototype, 'endOfYear', function endOfYear(this: Date): Date {
	const date = this.clone();
	date.setMonth(12, 0);
	return date.endOfDay();
});

/** @see [[DateConstructor.endOfYear]] */
extend(Date, 'endOfYear', (date: Date) => date.endOfYear());
