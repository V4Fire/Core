/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { locale as defaultLocale } from 'core/i18n';

/** @see Date.prototype.clone */
extend(Date.prototype, 'clone', function (this: Date): Date {
	return new Date(this);
});

/** @see Date.prototype.is */
extend(Date.prototype, 'is', function (this: Date, date: DateCreateValue, margin: number = 0): boolean {
	return Math.abs(this.valueOf() - Date.create(date).valueOf()) <= margin;
});

/** @see Date.prototype.isAfter */
extend(Date.prototype, 'isAfter', function (
	this: Date,
	date: DateCreateValue,
	margin: number = 0
): boolean {
	return this.valueOf() > Date.create(date).valueOf() - margin;
});

/** @see Date.prototype.isBefore */
extend(Date.prototype, 'isBefore', function (
	this: Date,
	date: DateCreateValue,
	margin: number = 0
): boolean {
	return this.valueOf() < Date.create(date).valueOf() + margin;
});

/** @see Date.prototype.isBetween */
extend(Date.prototype, 'isBetween', function (
	this: Date,
	date1: DateCreateValue,
	date2: DateCreateValue,
	margin: number = 0
): boolean {
	const v = this.valueOf();
	return v >= Date.create(date1).valueOf() - margin && v <= Date.create(date2).valueOf() + margin;
});

/** @see Date.prototype.isPast */
extend(Date.prototype, 'isPast', function (this: Date): boolean {
	return this.valueOf() < Date.now();
});

/** @see Date.prototype.isFuture */
extend(Date.prototype, 'isFuture', function (this: Date): boolean {
	return this.valueOf() > Date.now();
});

/** @see Date.prototype.beginningOfDay */
extend(Date.prototype, 'beginningOfDay', function (this: Date): Date {
	this.setHours(0, 0, 0, 0);
	return this;
});

/** @see Date.prototype.endOfDay */
extend(Date.prototype, 'endOfDay', function (this: Date): Date {
	this.setHours(23, 59, 59, 999);
	return this;
});

/** @see Date.prototype.beginningOfWeek */
extend(Date.prototype, 'beginningOfWeek', function (this: Date): Date {
	this.setDate(this.getDate() - this.getDay());
	this.beginningOfDay();
	return this;
});

/** @see Date.prototype.endOfWeek */
extend(Date.prototype, 'endOfWeek', function (this: Date): Date {
	this.setDate(this.getDate() + 7 - this.getDay());
	this.endOfDay();
	return this;
});

/** @see Date.prototype.beginningOfMonth */
extend(Date.prototype, 'beginningOfMonth', function (this: Date): Date {
	this.setDate(1);
	this.beginningOfDay();
	return this;
});

/** @see Date.prototype.endOfMonth */
extend(Date.prototype, 'endOfMonth', function (this: Date): Date {
	this.setMonth(this.getMonth() + 1, 0);
	this.endOfDay();
	return this;
});

/** @see Date.prototype.daysInMonth */
extend(Date.prototype, 'daysInMonth', function (this: Date): number {
	return this.clone().endOfMonth().getDate();
});

/** @see Date.prototype.beginningOfYear */
extend(Date.prototype, 'beginningOfYear', function (this: Date): Date {
	this.setMonth(0, 1);
	this.beginningOfDay();
	return this;
});

/** @see Date.prototype.endOfYear */
extend(Date.prototype, 'endOfYear', function (this: Date): Date {
	this.setMonth(12, 0);
	this.endOfDay();
	return this;
});

/** @see DateConstructor.getWeekDays */
extend(Date, 'getWeekDays', () =>
	[t`Mn`, t`Ts`, t`Wd`, t`Th`, t`Fr`, t`St`, t`Sn`]);

//#if runtime has prelude/date/modify

/** @see Date.prototype.add */
extend(Date.prototype, 'add', createDateModifier((v, b) => b + v));

/** @see Date.prototype.set */
extend(Date.prototype, 'set', createDateModifier());

/** @see Date.prototype.rewind */
extend(Date.prototype, 'rewind', createDateModifier((v, b) => b - v));

//#endif
//#if runtime has prelude/date/relative

/** @see Date.prototype.relative */
extend(Date.prototype, 'relative', function (this: Date): DateRelative {
	return relative(this, new Date());
});

/** @see Date.prototype.relativeTo */
extend(Date.prototype, 'relativeTo', function (this: Date, date: DateCreateValue): DateRelative {
	return relative(this, date);
});

//#endif
//#if runtime has prelude/date/format

const shortOpts = {
	month: 'numeric',
	day: 'numeric',
	year: 'numeric'
};

/** @see Date.prototype.short */
extend(Date.prototype, 'short', function (
	this: Date,
	locale: string = defaultLocale.value
): string {
	return this.toLocaleString(locale, shortOpts);
});

const mediumOpts = Object.createDict({
	month: 'long',
	day: 'numeric',
	year: 'numeric'
});

/** @see Date.prototype.medium */
extend(Date.prototype, 'medium', function (
	this: Date,
	locale: string = defaultLocale.value
): string {
	return this.toLocaleString(locale, mediumOpts);
});

/** @see Date.prototype.long */
extend(Date.prototype, 'long', function (
	this: Date,
	locale: string = defaultLocale.value
): string {
	return this.toLocaleString(locale);
});

const formatAliases = Object.createDict({
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

const defaultFormat = Object.createDict({
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

const convert = Object.createDict({
	'+': true,
	'-': false
});

const
	formatCache = Object.createDict<Intl.DateTimeFormatOptions>();

/** @see Date.prototype.format */
extend(Date.prototype, 'format', function (
	this: Date,
	pattern: string,
	locale: string = defaultLocale.value
): string {
	const
		cache = formatCache[pattern];

	if (cache) {
		return this.toLocaleString(locale, cache);
	}

	const
		chunks = pattern.split(';'),
		config = {};

	for (let i = 0; i < chunks.length; i++) {
		const
			el = chunks[i].trim();

		let
			[key, val] = el.split(':');

		key = key.trim();

		if (val) {
			val = val.trim();
		}

		const
			alias = formatAliases[key];

		if (alias) {
			key = alias;
		}

		if (!val) {
			val = defaultFormat[key];
		}

		config[key] = val in convert ? convert[val] : val;
	}

	formatCache[pattern] = config;
	return this.toLocaleString(locale, config);
});

/** @see Date.prototype.toHTMLDateString */
extend(Date.prototype, 'toHTMLDateString', function (
	this: Date,
	opts: DateHTMLDateStringOptions = {}
): string {
	const
		s = (v) => String(v).padStart(2, '0'),
		needMonth = opts.month !== false;

	return [
		this.getFullYear(),
		needMonth ? s(this.getMonth() + 1) : '01',
		needMonth && opts.date !== false ? s(this.getDate()) : '01'
	].join('-');
});

/** @see Date.prototype.toHTMLTimeString */
extend(Date.prototype, 'toHTMLTimeString', function (
	this: Date,
	opts: DateHTMLTimeStringOptions = {}
): string {
	const
		s = (v) => String(v).padStart(2, '0'),
		res = [s(this.getHours()), opts.minutes ? s(this.getMinutes()) : '00'];

	if (opts.seconds) {
		const
			sec = s(this.getSeconds());

		if (opts.milliseconds) {
			res.push(`${sec}.${this.getMilliseconds()}`);

		} else {
			res.push(sec);
		}
	}

	return res.join(':');
});

/** @see Date.prototype.toHTMLString */
extend(Date.prototype, 'toHTMLString', function (this: Date, opts: DateHTMLStringOptions): string {
	return `${this.toHTMLDateString(opts)}T${this.toHTMLTimeString(opts)}`;
});

//#endif
//#if runtime has prelude/date/create

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
	isDateStr = /^(\d{4}-\d{2}-\d{2})([T ])(\d{2}:\d{2}:\d{2}(?:\.\d{3})?)(?:\d{0,3})?(Z)?([+-]\d{2}:?\d{2})?$/,
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

			pattern = pattern.replace(
				isDateStr,
				(str, date, t, time, zone) => `${date}T${time}${zone === 'Z' || !zone ? createISOTime() : ''}`
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

//#endif
//#if runtime has prelude/date/relative

function relative(from: DateCreateValue, to: DateCreateValue): DateRelative {
	const
		diff = Date.create(to).valueOf() - Date.create(from).valueOf();

	const intervals = [
		{type: 'milliseconds', bound: 1e3},
		{type: 'seconds', bound: 1e3 * 60},
		{type: 'minutes', bound: 1e3 * 60 * 60},
		{type: 'hours', bound: 1e3 * 60 * 60 * 24},
		{type: 'days', bound: 1e3 * 60 * 60 * 24 * 7},
		{type: 'weeks', bound: 1e3 * 60 * 60 * 24 * 30},
		{type: 'months', bound: 1e3 * 60 * 60 * 24 * 365}
	];

	for (let i = 0; i < intervals.length; i++) {
		const
			{type, bound} = intervals[i];

		if (Math.abs(diff) < bound) {
			return {
				type: <DateRelative['type']>type,
				value: Number((diff / (i ? intervals[i - 1].bound : 1)).toFixed(2)),
				diff
			};
		}
	}

	return {
		type: 'years',
		value: Number((diff / intervals[intervals.length - 1].bound).toFixed(2)),
		diff
	};
}

//#endif
//#if runtime has prelude/date/modify

function createDateModifier(mod: (val: number, base: number) => number = ((Any))): Function {
	return function modifyDate(this: Date, params: DateSetParams, reset?: boolean): Date {
		const
			resetValues = <Record<keyof DateSetParams, boolean>>{};

		const setResetValue = (...keys: Array<keyof DateSetParams>) => {
			for (let i = 0; i < keys.length; i++) {
				const
					key = keys[i];

				if (resetValues[key] !== false) {
					resetValues[key] = true;
				}
			}
		};

		for (let keys = Object.keys(params), i = 0; i < keys.length; i++) {
			const
				key = keys[i];

			if (key.slice(-1) !== 's') {
				params[`${key}s`] = params[key];
			}
		}

		if (params.milliseconds != null) {
			resetValues.milliseconds = false;
			this.setMilliseconds(mod(params.milliseconds, this.getMilliseconds()));
		}

		if (params.seconds != null) {
			resetValues.seconds = false;
			setResetValue('milliseconds');
			this.setSeconds(mod(params.seconds, this.getSeconds()));
		}

		if (params.minutes != null) {
			resetValues.minutes = false;
			setResetValue('milliseconds', 'seconds');
			this.setMinutes(mod(params.minutes, this.getMinutes()));
		}

		if (params.hours) {
			resetValues.hours = false;
			setResetValue('milliseconds', 'seconds', 'minutes');
			this.setHours(mod(params.hours, this.getHours()));
		}

		if (params.days) {
			resetValues.days = false;
			setResetValue('milliseconds', 'seconds', 'minutes', 'hours');
			this.setDate(mod(params.days, this.getDate()));
		}

		if (params.months) {
			resetValues.months = false;
			setResetValue('milliseconds', 'seconds', 'minutes', 'hours', 'days');
			this.setMonth(mod(params.months, this.getMonth()));
		}

		if (params.years) {
			resetValues.years = false;
			setResetValue('milliseconds', 'seconds', 'minutes', 'hours', 'days', 'months');
			this.setFullYear(params.years);
		}

		if (reset) {
			if (resetValues.milliseconds) {
				this.setMilliseconds(0);
			}

			if (resetValues.seconds) {
				this.setSeconds(0);
			}

			if (resetValues.minutes) {
				this.setMinutes(0);
			}

			if (resetValues.hours) {
				this.setHours(0);
			}

			if (resetValues.days) {
				this.setDate(1);
			}

			if (resetValues.months) {
				this.setMonth(0);
			}
		}

		return this;
	};
}

//#endif
