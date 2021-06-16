/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { createDateModifier, createStaticDateModifier } from 'core/prelude/date/helpers';

/** @see [[Date.beginningOfDay]] */
extend(Date.prototype, 'beginningOfDay', function beginningOfDay(this: Date): Date {
	this.clone().setHours(0, 0, 0, 0);
	return this;
});

/** @see [[DateConstructor.beginningOfDay]] */
extend(Date, 'beginningOfDay', (date: Date) => date.beginningOfDay());

/** @see [[Date.endOfDay]] */
extend(Date.prototype, 'endOfDay', function endOfDay(this: Date): Date {
	this.clone().setHours(23, 59, 59, 999);
	return this;
});

/** @see [[DateConstructor.endOfDay]] */
extend(Date, 'endOfDay', (date: Date) => date.endOfDay());

/** @see [[Date.beginningOfWeek]] */
extend(Date.prototype, 'beginningOfWeek', function beginningOfWeek(this: Date): Date {
	const date = this.clone();
	date.setDate(this.getDate() - this.getDay());
	return date.beginningOfDay();
});

/** @see [[DateConstructor.beginningOfWeek]] */
extend(Date, 'beginningOfWeek', (date: Date) => date.beginningOfWeek());

/** @see [[Date.endOfWeek]] */
extend(Date.prototype, 'endOfWeek', function endOfWeek(this: Date): Date {
	const date = this.clone();
	date.setDate(this.getDate() + 6 - this.getDay());
	return date.endOfDay();
});

/** @see [[DateConstructor.endOfWeek]] */
extend(Date, 'endOfWeek', (date: Date) => date.endOfWeek());

/** @see [[Date.beginningOfMonth]] */
extend(Date.prototype, 'beginningOfMonth', function beginningOfMonth(this: Date): Date {
	const date = this.clone();
	date.setDate(1);
	return date.beginningOfDay();
});

/** @see [[DateConstructor.beginningOfMonth]] */
extend(Date, 'beginningOfMonth', (date: Date) => date.beginningOfMonth());

/** @see [[Date.endOfMonth]] */
extend(Date.prototype, 'endOfMonth', function endOfMonth(this: Date): Date {
	const date = this.clone();
	date.setMonth(this.getMonth() + 1, 0);
	return date.endOfDay();
});

/** @see [[DateConstructor.endOfMonth]] */
extend(Date, 'endOfMonth', (date: Date) => date.endOfMonth());

/** @see [[Date.daysInMonth]] */
extend(Date.prototype, 'daysInMonth', function daysInMonth(this: Date): number {
	return this.clone().endOfMonth().getDate();
});

/** @see [[DateConstructor.daysInMonth]] */
extend(Date, 'daysInMonth', (date: Date) => date.daysInMonth());

/** @see [[Date.beginningOfYear]] */
extend(Date.prototype, 'beginningOfYear', function beginningOfYear(this: Date): Date {
	const date = this.clone();
	date.setMonth(0, 1);
	return date.beginningOfDay();
});

/** @see [[DateConstructor.beginningOfYear]] */
extend(Date, 'beginningOfYear', (date: Date) => date.beginningOfYear());

/** @see [[Date.endOfYear]] */
extend(Date.prototype, 'endOfYear', function endOfYear(this: Date): Date {
	const date = this.clone();
	date.setMonth(12, 0);
	return date.endOfDay();
});

/** @see [[DateConstructor.endOfYear]] */
extend(Date, 'endOfYear', (date: Date) => date.endOfYear());

/** @see [[Date.add]] */
extend(Date.prototype, 'add', createDateModifier((v, b) => b + v));

/** @see [[DateConstructor.add]] */
extend(Date, 'add', createStaticDateModifier('add'));

/** @see [[Date.set]] */
extend(Date.prototype, 'set', createDateModifier());

/** @see [[DateConstructor.set]] */
extend(Date, 'set', createStaticDateModifier('set'));

/** @see [[Date.rewind]] */
extend(Date.prototype, 'rewind', createDateModifier((v, b) => b - v));

/** @see [[DateConstructor.rewind]] */
extend(Date, 'rewind', createStaticDateModifier('rewind'));
