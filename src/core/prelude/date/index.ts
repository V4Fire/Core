/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { locale as defaultLocale } from 'core/i18n';

/**
 * Clones the date object and returns a new object
 */
extend(Date.prototype, 'clone', function (this: Date): Date {
	return new Date(this);
});

/**
 * Returns true if the date is equals to another
 *
 * @param date - another date to compare
 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
 *   (in milliseconds)
 */
extend(Date.prototype, 'is', function (this: Date, date: DateCreateValue, margin: number = 0): boolean {
	return Math.abs(this.valueOf() - Date.create(date).valueOf()) <= margin;
});

/**
 * Returns true if the date is greater than another
 *
 * @param date - another date to compare
 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
 *   (in milliseconds)
 */
extend(Date.prototype, 'isAfter', function (
	this: Date,
	date: DateCreateValue,
	margin: number = 0
): boolean {
	return this.valueOf() > Date.create(date).valueOf() - margin;
});

/**
 * Returns true if the date is between of two other (including the bounding dates)
 *
 * @param date1 - date of the beginning
 * @param date2 - date of the ending
 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
 *   (in milliseconds)
 */
extend(Date.prototype, 'isBetween', function (
	this: Date,
	date1: DateCreateValue,
	date2: DateCreateValue,
	margin: number = 0
): boolean {
	const v = this.valueOf();
	return v >= Date.create(date1).valueOf() - margin && v <= Date.create(date2).valueOf() + margin;
});

/**
 * Returns true if the date is less than another
 *
 * @param date - another date to compare
 * @param [margin] - value of the maximum difference between two dates at which they are considered equal
 *   (in milliseconds)
 */
extend(Date.prototype, 'isBefore', function (
	this: Date,
	date: DateCreateValue,
	margin: number = 0
): boolean {
	return this.valueOf() < Date.create(date).valueOf() + margin;
});

/**
 * Returns true if the date is less than the now date
 */
extend(Date.prototype, 'isPast', function (this: Date): boolean {
	return this.valueOf() < Date.now();
});

/**
 * Returns true if the date is greater than the now date
 */
extend(Date.prototype, 'isFuture', function (this: Date): boolean {
	return this.valueOf() > Date.now();
});

/**
 * Changes the date time so that it starts at the beginning of a day and returns it
 */
extend(Date.prototype, 'beginningOfDay', function (this: Date): Date {
	this.setHours(0, 0, 0, 0);
	return this;
});

/**
 * Changes the date time so that it starts at the ending of a day and returns it
 */
extend(Date.prototype, 'endOfDay', function (this: Date): Date {
	this.setHours(23, 59, 59, 999);
	return this;
});

/**
 * Changes the date so that it starts at the beginning of a week and returns it
 */
extend(Date.prototype, 'beginningOfWeek', function (this: Date): Date {
	this.setDate(this.getDate() - this.getDay());
	this.beginningOfDay();
	return this;
});

/**
 * Changes the date so that it starts at the ending of a week and returns it
 */
extend(Date.prototype, 'endOfWeek', function (this: Date): Date {
	this.setDate(this.getDate() + 7 - this.getDay());
	this.endOfDay();
	return this;
});

/**
 * Changes the date so that it starts at the beginning of a month and returns it
 */
extend(Date.prototype, 'beginningOfMonth', function (this: Date): Date {
	this.setDate(1);
	this.beginningOfDay();
	return this;
});

/**
 * Changes the date so that it starts at the ending of a month and returns it
 */
extend(Date.prototype, 'endOfMonth', function (this: Date): Date {
	this.setMonth(this.getMonth() + 1, 0);
	this.endOfDay();
	return this;
});

/**
 * Returns a number of days in the date month
 */
extend(Date.prototype, 'daysInMonth', function (this: Date): number {
	return this.clone().endOfMonth().getDate();
});

/**
 * Changes the date so that it starts at the beginning of a year and returns it
 */
extend(Date.prototype, 'beginningOfYear', function (this: Date): Date {
	this.setMonth(0, 1);
	this.beginningOfDay();
	return this;
});

/**
 * Changes the date so that it starts at the ending of a year and returns it
 */
extend(Date.prototype, 'endOfYear', function (this: Date): Date {
	this.setMonth(12, 0);
	this.endOfDay();
	return this;
});

/**
 * Returns a list of week days
 */
extend(Date, 'getWeekDays', () =>
	[t`Mn`, t`Ts`, t`Wd`, t`Th`, t`Fr`, t`St`, t`Sn`]);

//#if runtime has prelude/date/modify

/** @see Sugar.Date.add */
extend(Date.prototype, 'add', createDateModifier((v, b) => b + v));

/** @see Sugar.Date.set */
extend(Date.prototype, 'set', createDateModifier());

/** @see Sugar.Date.rewind */
extend(Date.prototype, 'rewind', createDateModifier((v, b) => b - v));

//#endif
//#if runtime has prelude/date/relative

/**
 * Returns a relative value of the date for the now date
 */
extend(Date.prototype, 'relative', function (this: Date): DateRelative {
	return relative(this, new Date());
});

/**
 * Returns a relative value of the date for the specified date
 */
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

/**
 * Returns a short string representation of the date.
 * This method is based on the native Intl API.
 *
 * @param [locale] - locale for internalizing
 *
 * @example
 * new Date('12/28/2019').short('en-us') // '12/28/2019'
 */
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

/**
 * Returns a medium string representation of the date.
 * This method is based on the native Intl API.
 *
 * @param [locale] - locale for internalizing
 *
 * @example
 * new Date('12/28/2019').medium('en-us') // 'December 28, 2019'
 */
extend(Date.prototype, 'medium', function (
	this: Date,
	locale: string = defaultLocale.value
): string {
	return this.toLocaleString(locale, mediumOpts);
});

/**
 * Returns a long string representation of the date.
 * This method is based on the native Intl API.
 *
 * @param [locale] - locale for internalizing
 *
 * @example
 * new Date('12/28/2019').long('en-us') // '12/28/2019, 12:00:00 A'
 */
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

/**
 * Returns a string representation of the date by the specified pattern.
 * This method is based on the native Intl API.
 * All pattern directives is bases on native Date Intl options:
 *
 *   *) era
 *   *) year
 *   *) month
 *   *) day
 *   *) weekday
 *   *) hour
 *   *) minute
 *   *) second
 *   *) timeZoneName
 *
 * There are aliases for all directives:
 *
 *   *) e - era
 *   *) Y - year
 *   *) M - month
 *   *) d - day
 *   *) w - weekday
 *   *) h - hour
 *   *) m - minute
 *   *) s - second
 *   *) z - timeZoneName
 *
 * @param pattern - string pattern of the format:
 *   *) the symbol ";" is used as a separator character for pattern directives, for example: year;month
 *   *) the symbol ":" is used for specifying a custom value for a pattern directive, for example:
 *      year:2-digit;month:short
 *
 * @param [locale] - locale for internalizing
 *
 * @example
 * new Date('12/28/2019').format('year', 'en-us') // '2019'
 * new Date('12/28/2019').format('year:2-digit', 'en-us') // '19'
 * new Date('12/28/2019').format('year:2-digit;month', 'en-us') // 'Dec 19'
 *
 * // Formatting a date using short aliases
 * new Date('12/28/2019').format('Y:2-digit;M:long;d', 'en-us') // 'December 28, 19'
 */
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

/**
 * Returns a HTML string representation of a date (without time).
 * This method is useful for providing date values within HTML tag attributes.
 *
 * @param [opts] - additional options:
 *   *) [month] - if false, then the date month is taken from the beginning of the now year
 *   *) [date] - if false, then the date day is taken from the beginning of the now month
 */
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

/**
 * Returns a HTML string representation of a timestamp.
 * This method is useful for providing timestamp values within HTML tag attributes.
 *
 * @param [opts] - additional options:
 *   *) [minutes] - if false, then the date month is taken from the beginning of of the now hour
 *   *) [seconds] - if false, then the date second is taken from the beginning of of the now minute
 *   *) [milliseconds] - if false, then the date millisecond is taken from the beginning of of the now second
 */
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

/**
 * Returns a HTML string representation of a datetime.
 * This method is useful for providing datetime values within HTML tag attributes.
 *
 * @param [opts] - additional options:
 *   *) [month] - if false, then the date month is taken from the beginning of a year
 *   *) [date] - if false, then the date day is taken from the beginning of a month
 *   *) [minutes] - if false, then the date month is taken from the beginning of of the now hour
 *   *) [seconds] - if false, then the date second is taken from the beginning of of the now minute
 *   *) [milliseconds] - if false, then the date millisecond is taken from the beginning of of the now second
 */
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

/**
 * Creates a date from the specified pattern.
 * This method can create a new date object from:
 *
 *   *) another date object
 *   *) a number of milliseconds (if the number is integer)
 *   *) a number of seconds (if the number is float)
 *   *) a number of seconds (if the number is float)
 *   *) a string pattern using the native Date.parse with some polyfills
 *   *) a string aliases:
 *
 *      *) now - is an alias for the now date
 *      *) today - is an alias for the beginning of the today
 *      *) yesterday - is an alias for the beginning of the yesterday
 *      *) tomorrow - is an alias for the beginning of the tomorrow
 *
 * @param [pattern]
 */
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
