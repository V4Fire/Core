/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see Date.prototype.clone */
extend(Date.prototype, 'clone', function (this: Date): Date {
	return new Date(this);
});

const aliases = Object.createDict({
	now: () => new Date(),
	today: () => new Date().beginningOfDay(),

	yesterday: () => {
		const v = new Date();
		v.setDate(v.getDate() - 1);
		return v.beginningOfDay();
	},

	tomorrow: () => {
		const v = new Date();
		v.setDate(v.getDate() + 1);
		return v.beginningOfDay();
	}
});

const
	isDateStr = /^(\d{2,4}[-.\/]\d{2}[-.\/]\d{2,4})([T ])?(\d{2}:\d{2}:\d{2}(?:\.\d{3})?)?(?:\d{0,3})?(Z)?([+-]\d{2}:?\d{2})?$/,
	dateNormalizeRgxp = /(\d{2,4})[-.\/](\d{2})[-.\/](\d{2,4})/,
	isFloatStr = /^\d+\.\d+$/;

/** @see Date.prototype.create */
extend(Date, 'create', (pattern?: DateCreateValue) => {
	if (pattern == null || pattern === '') {
		return new Date();
	}

	if (Object.isString(pattern)) {
		if (pattern in aliases) {
			return aliases[pattern]();
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
