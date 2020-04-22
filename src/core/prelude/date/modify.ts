/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { createDateModifier, createStaticDateModifier } from 'core/prelude/date/helpers';

/** @see Date.beginningOfDay */
extend(Date.prototype, 'beginningOfDay', function (this: Date): Date {
	this.setHours(0, 0, 0, 0);
	return this;
});

/** @see DateConstructor.beginningOfDay */
extend(Date, 'beginningOfDay', (date: Date) => date.beginningOfDay());

/** @see Date.endOfDay */
extend(Date.prototype, 'endOfDay', function (this: Date): Date {
	this.setHours(23, 59, 59, 999);
	return this;
});

/** @see DateConstructor.endOfDay */
extend(Date, 'endOfDay', (date: Date) => date.endOfDay());

/** @see Date.beginningOfWeek */
extend(Date.prototype, 'beginningOfWeek', function (this: Date): Date {
	this.setDate(this.getDate() - this.getDay());
	this.beginningOfDay();
	return this;
});

/** @see DateConstructor.beginningOfWeek */
extend(Date, 'beginningOfWeek', (date: Date) => date.beginningOfWeek());

/** @see Date.endOfWeek */
extend(Date.prototype, 'endOfWeek', function (this: Date): Date {
	this.setDate(this.getDate() + 7 - this.getDay());
	this.endOfDay();
	return this;
});

/** @see DateConstructor.endOfWeek */
extend(Date, 'endOfWeek', (date: Date) => date.endOfWeek());

/** @see Date.beginningOfMonth */
extend(Date.prototype, 'beginningOfMonth', function (this: Date): Date {
	this.setDate(1);
	this.beginningOfDay();
	return this;
});

/** @see DateConstructor.beginningOfMonth */
extend(Date, 'beginningOfMonth', (date: Date) => date.beginningOfMonth());

/** @see Date.endOfMonth */
extend(Date.prototype, 'endOfMonth', function (this: Date): Date {
	this.setMonth(this.getMonth() + 1, 0);
	this.endOfDay();
	return this;
});

/** @see DateConstructor.endOfMonth */
extend(Date, 'endOfMonth', (date: Date) => date.endOfMonth());

/** @see Date.daysInMonth */
extend(Date.prototype, 'daysInMonth', function (this: Date): number {
	return this.clone().endOfMonth().getDate();
});

/** @see DateConstructor.daysInMonth */
extend(Date, 'daysInMonth', (date: Date) => date.daysInMonth());

/** @see Date.beginningOfYear */
extend(Date.prototype, 'beginningOfYear', function (this: Date): Date {
	this.setMonth(0, 1);
	this.beginningOfDay();
	return this;
});

/** @see DateConstructor.beginningOfYear */
extend(Date, 'beginningOfYear', (date: Date) => date.beginningOfYear());

/** @see Date.endOfYear */
extend(Date.prototype, 'endOfYear', function (this: Date): Date {
	this.setMonth(12, 0);
	this.endOfDay();
	return this;
});

/** @see DateConstructor.endOfYear */
extend(Date, 'endOfYear', (date: Date) => date.endOfYear());

/** @see Date.add */
extend(Date.prototype, 'add', createDateModifier((v, b) => b + v));

/** @see DateConstructor.add */
extend(Date, 'add', createStaticDateModifier('add'));

/** @see Date.set */
extend(Date.prototype, 'set', createDateModifier());

/** @see DateConstructor.set */
extend(Date, 'set', createStaticDateModifier('set'));

/** @see Date.rewind */
extend(Date.prototype, 'rewind', createDateModifier((v, b) => b - v));

/** @see DateConstructor.rewind */
extend(Date, 'rewind', createStaticDateModifier('rewind'));
