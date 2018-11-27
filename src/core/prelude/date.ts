/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { lang } from 'core/i18n';

/** @see Sugar.Date.is */
extend(Date.prototype, 'is', function (date: DateCreateValue, margin: number = 0): boolean {
	return Math.abs(this.valueOf() - Date.create(date).valueOf()) <= margin;
});

/** @see Sugar.Date.isAfter */
extend(Date.prototype, 'isAfter', function (date: DateCreateValue, margin: number = 0): boolean {
	return this.valueOf() > Date.create(date).valueOf() - margin;
});

/** @see Sugar.Date.isBefore */
extend(Date.prototype, 'isBefore', function (date: DateCreateValue, margin: number = 0): boolean {
	return this.valueOf() < Date.create(date).valueOf() + margin;
});

/** @see Sugar.Date.isPast */
extend(Date.prototype, 'isPast', function (this: Date): boolean {
	return this.valueOf() < Date.now();
});

/** @see Sugar.Date.isFuture */
extend(Date.prototype, 'isFuture', function (this: Date): boolean {
	return this.valueOf() > Date.now();
});

/** @see Sugar.Date.isPast */
extend(Date.prototype, 'isPast', function (this: Date): boolean {
	return this.valueOf() < Date.now();
});

/** @see Sugar.Date.beginningOfDay */
extend(Date.prototype, 'beginningOfDay', function (this: Date): Date {
	this.setHours(0, 0, 0, 0);
	return this;
});

/** @see Sugar.Date.endOfDay */
extend(Date.prototype, 'endOfDay', function (this: Date): Date {
	this.setHours(23, 59, 59, 999);
	return this;
});

/** @see Sugar.Date.beginningOfWeek */
extend(Date.prototype, 'beginningOfWeek', function (this: Date): Date {
	this.setDate(this.getDate() - this.getDay());
	this.beginningOfDay();
	return this;
});

/** @see Sugar.Date.endOfWeek */
extend(Date.prototype, 'endOfWeek', function (this: Date): Date {
	this.setDate(this.getDate() + 7 - this.getDay());
	this.endOfDay();
	return this;
});

/** @see Sugar.Date.beginningOfMonth */
extend(Date.prototype, 'beginningOfMonth', function (this: Date): Date {
	this.setDate(1);
	this.beginningOfDay();
	return this;
});

/** @see Sugar.Date.endOfMonth */
extend(Date.prototype, 'endOfMonth', function (this: Date): Date {
	this.setMonth(this.getMonth() + 1, 0);
	this.endOfDay();
	return this;
});

/** @see Sugar.Date.beginningOfYear */
extend(Date.prototype, 'beginningOfYear', function (this: Date): Date {
	this.setMonth(0, 1);
	this.beginningOfDay();
	return this;
});

/** @see Sugar.Date.endOfYear */
extend(Date.prototype, 'endOfYear', function (this: Date): Date {
	this.setMonth(12, 0);
	this.endOfDay();
	return this;
});

/** @see Sugar.Date.set */
extend(Date.prototype, 'set', function (this: Date, params: DateSetParams, reset?: boolean): Date {
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

	if (params.milliseconds != null) {
		resetValues.milliseconds = false;
		this.setMilliseconds(params.milliseconds);
	}

	if (params.seconds != null) {
		resetValues.seconds = false;
		setResetValue('milliseconds');
		this.setSeconds(params.seconds);
	}

	if (params.minutes != null) {
		resetValues.minutes = false;
		setResetValue('milliseconds', 'seconds');
		this.setMinutes(params.minutes);
	}

	if (params.hours) {
		resetValues.hours = false;
		setResetValue('milliseconds', 'seconds', 'minutes');
		this.setHours(params.hours);
	}

	if (params.days) {
		resetValues.days = false;
		setResetValue('milliseconds', 'seconds', 'minutes', 'hours');
		this.setDate(params.days);
	}

	if (params.months) {
		resetValues.months = false;
		setResetValue('milliseconds', 'seconds', 'minutes', 'hours', 'days');
		this.setDate(params.months);
	}

	if (params.years) {
		resetValues.months = false;
		setResetValue('milliseconds', 'seconds', 'minutes', 'hours', 'days', 'months');
		this.setDate(params.years);
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
});

/**
 * Returns a list of week days
 */
extend(Date, 'getWeekDays', () =>
	[t`Mn`, t`Ts`, t`Wd`, t`Th`, t`Fr`, t`St`, t`Sn`]);

const aliases = {
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
};

/**
 * Creates a date from the specified pattern
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

		return Date.parse(pattern);
	}

	return new Date(pattern.valueOf());
});

const
	{format: sugarFormat} = Date.prototype,
	formatRgxp = /{(humanTimeDate|humanDate)}/g;

/**
 * Date.format wrapper
 * (added: {humanTimeDate} and {humanDate})
 *
 * @param value
 */
Date.prototype.format = function format(value: string): string {
	const aliases = {
		humanTimeDate: '{HH}:{mm} {humanDate}',
		humanDate: lang === 'ru' ? '{dd}.{MM}.{yyyy}' : '{MM}.{dd}.{yyyy}'
	};

	const replace = (str) => str.replace(formatRgxp, (str, $1) => aliases[$1]);
	return sugarFormat.call(this, replace(value), lang);
};
