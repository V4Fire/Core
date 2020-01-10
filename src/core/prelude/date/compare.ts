/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

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
