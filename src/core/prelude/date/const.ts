/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export const
	formatCache = Object.createDict<Intl.DateTimeFormat>();

export const
	dateChunkRgxp = /(\d{1,4}[-./]\d{1,2}[-./]\d{1,4})/,
	timeChunkRgxp = /[T ]*(\d{2}:\d{2}:\d{2}(?:\.\d{3})?)?(?:\d{0,3})?/,
	zoneChunkRgxp = /(Z?([+-]\d{2}:?\d{2})?)/;

export const
	normalizeDateChunkRgxp = /(\d{1,4})[-./](\d{1,2})[-./](\d{1,4})/,
	normalizeZoneRgxp = /^[+-]\d{4}$/;

export const
	isDateStr = new RegExp(`^${dateChunkRgxp.source}${timeChunkRgxp.source}${zoneChunkRgxp.source}$`),
	isFloatStr = /^\d+\.\d+$/;

export const createAliases = Object.createDict({
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

export const formatAliases = Object.createDict({
	e: 'era',
	Y: 'year',
	M: 'month',
	d: 'day',
	w: 'weekday',
	h: 'hour',
	m: 'minute',
	s: 'second',
	z: 'timeZoneName'
});

Object.forEach(formatAliases, (val) => {
	formatAliases[val] = val;
});

['Y', 'M', 'w', 'd', 'h', 'm', 's'].forEach((key) => {
	const format = (date) => {
		const
			now = new Date();

		if (date.format(key) !== now.format(key)) {
			return key;
		}
	};

	formatAliases[`${key}?`] = format;
	formatAliases[`${formatAliases[key]}?`] = format;
});

export const boolAliases = Object.createDict({
	'+': true,
	'-': false
});

export const defaultFormats = Object.createDict(<Intl.DateTimeFormatOptions>{
	era: 'short',
	year: 'numeric',
	month: 'short',
	day: '2-digit',
	weekday: 'short',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	timeZoneName: 'short'
});
