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
	isDateStr = /^(\d{2,4}[-.\/]\d{2}[-.\/]\d{2,4})([T ])?(\d{2}:\d{2}:\d{2}(?:\.\d{3})?)?(?:\d{0,3})?(Z)?([+-]\d{2}:?\d{2})?$/,
	dateNormalizeRgxp = /(\d{2,4})[-.\/](\d{2})[-.\/](\d{2,4})/,
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
