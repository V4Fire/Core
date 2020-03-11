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

const
	isDateStr = /^(?<date>\d{2,4}(?<ds>[-.\/])\d{2}\k<ds>\d{2,4})(?<t>[T ])?(?<time>\d{2}:\d{2}:\d{2}(?:\.\d{3})?)?(?:\d{0,3})?(?<zone>Z)?([+-]\d{2}:?\d{2})?$/,
	isFloatStr = /^\d+\.\d+$/;

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

			const normalizeDate = (date: string): string => {
				const res = /(\d{2,4})(?<ds>[-.\/])(\d{2})\k<ds>(\d{2,4})/.exec(date);

				if (!res) {
					return date;
				}

				const
					year = res[1].length === 4 ? res[1] : res[4],
					day = res[1].length === 2 ? res[1] : res[4];

				return `${year}-${res[3]}-${day}`;
			};

			const result = isDateStr.exec(pattern),
				groups = result?.groups;

			if (groups) {
				pattern = `${normalizeDate(groups.date)}T${groups.time || '00:00:01'}${groups.zone === 'Z' || !groups.zone ? createISOTime() : ''}`
			}

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
