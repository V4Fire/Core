/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { createStaticDateComparator } from 'core/prelude/date/helpers';

import { create } from 'core/prelude/date/create';

/** @see [[Date.is]] */
export const is = extend(Date.prototype, 'is', function is(this: Date, date: DateCreateValue, margin: number = 0): boolean {
	return Math.abs(this.valueOf() - create(date).valueOf()) <= margin;
});

/** @see [[Date.isPast]] */
export const isPast = extend(Date.prototype, 'isPast', function isPast(this: Date): boolean {
	return this.valueOf() < Date.now();
});

/** @see [[Date.isFuture]] */
export const isFuture = extend(Date.prototype, 'isFuture', function isFuture(this: Date): boolean {
	return this.valueOf() > Date.now();
});

/** @see [[Date.isAfter]] */
export const isAfter = extend(Date.prototype, 'isAfter', function isAfter(
	this: Date,
	date: DateCreateValue,
	margin: number = 0
): boolean {
	return this.valueOf() > create(date).valueOf() - margin;
});

/** @see [[Date.isBefore]] */
export const isBefore = extend(Date.prototype, 'isBefore', function isBefore(
	this: Date,
	date: DateCreateValue,
	margin: number = 0
): boolean {
	return this.valueOf() < create(date).valueOf() + margin;
});

/** @see [[Date.isBetween]] */
export const isBetween = extend(Date.prototype, 'isBetween', function isBetween(
	this: Date,
	left: DateCreateValue,
	right: DateCreateValue,
	margin: number = 0
): boolean {
	const v = this.valueOf();
	return v >= create(left).valueOf() - margin && v <= create(right).valueOf() + margin;
});

//#if prelude/standalone
/** @see [[DateConstructor.isBetween]] */
extend(Date, 'isBetween', function isBetween(
	date: DateCreateValue,
	left?: DateCreateValue,
	right?: DateCreateValue,
	margin?: number
): boolean | AnyFunction {
	if (arguments.length < 3) {
		if (Object.isNumber(date)) {
			margin = date;

		} else {
			right = left;
			left = date;
		}

		return (date, l, r, m) => Date.isBetween(date, left ?? l, right ?? r, margin ?? m);
	}

	return Date.create(date).isBetween(left!, right!, margin ?? 0);
});

/** @see [[DateConstructor.isBefore]] */
extend(Date, 'isBefore', createStaticDateComparator('isBefore'));

/** @see [[DateConstructor.isAfter]] */
extend(Date, 'isAfter', createStaticDateComparator('isAfter'));

/** @see [[DateConstructor.isFuture]] */
extend(Date, 'isFuture', (date: Date) => date.isFuture());

/** @see [[DateConstructor.isPast]] */
extend(Date, 'isPast', (date: Date) => date.isPast());

/** @see [[DateConstructor.is]] */
extend(Date, 'is', createStaticDateComparator('is'));
//#endif
