/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

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
