/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { isDateStr, isFloatStr, dateNormalizeRgxp, createAliases } from 'core/prelude/date/const';

/** @see Date.clone */
extend(Date.prototype, 'clone', function (this: Date): Date {
	return new Date(this);
});

/** @see Date.create */
extend(Date, 'create', (pattern?: DateCreateValue) => {
	if (pattern == null || pattern === '') {
		return new Date();
	}

	if (Object.isString(pattern)) {
		if (pattern in createAliases) {
			return createAliases[pattern]();
		}

		if (isDateStr.test(pattern)) {
			const createISOTime = () => {
				const
					h = new Date().getTimezoneOffset() / 60,
					abs = Math.abs(h);

				return `${h <= 0 ? '+' : '-'}${abs > 9 ? abs : `0${abs}`}:00`;
			};

			const normalizeDate = (date) => {
				const
					chunks = dateNormalizeRgxp.exec(date);

				if (!chunks) {
					return date;
				}

				const
					year = chunks[1].length === 4 ? chunks[1] : chunks[3],
					day = chunks[1].length === 2 ? chunks[1] : chunks[3];

				return `${year}-${chunks[2]}-${day}`;
			};

			pattern = pattern.replace(
				isDateStr,
				(str, date, t, time, zone) =>
					`${normalizeDate(date)}T${time || '00:00:01'}${zone === 'Z' || !zone ? createISOTime() : ''}`
			);

		} else {
			return new Date(pattern);
		}

		return new Date(Date.parse(pattern));
	}

	if (Object.isString(pattern) && isFloatStr.test(pattern)) {
		const float = parseFloat(pattern);
		pattern = float ? float * 1e3 : pattern;

	} else if (Object.isNumber(pattern) && !pattern.isInteger()) {
		pattern *= 1e3;
	}

	return new Date(pattern.valueOf());
});
