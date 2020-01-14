/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

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

/** @see Date.prototype.add */
extend(Date.prototype, 'add', createDateModifier((v, b) => b + v));

/** @see Date.prototype.set */
extend(Date.prototype, 'set', createDateModifier());

/** @see Date.prototype.rewind */
extend(Date.prototype, 'rewind', createDateModifier((v, b) => b - v));

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
