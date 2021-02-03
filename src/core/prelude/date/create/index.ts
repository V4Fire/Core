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

		const getZone = () => {
			const h = new Date().getTimezoneOffset() / 60;
			return `${h <= 0 ? '+' : '-'}${Math.abs(h).toString().padStart(2, '0')}:00`;
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
				day = chunks[1].length === 2 ? chunks[1] : chunks[3];

			return `${year}-${chunks[2]}-${day}`;
		};

		const replacer = (str, date, time, zone) => {
			time = Object.isTruly(time) ? time : '00:00:00';
			zone = Object.isTruly(zone) ? zone : getZone();
			return `${normalizeDate(date)}T${time}${normalizeZone(zone)}`;
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
