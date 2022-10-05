/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { createStaticDateComparator } from 'core/prelude/date/helpers';

/** @see {@link Date.is} */
extend(Date.prototype, 'is', function is(this: Date, date: DateCreateValue, margin: number = 0): boolean {
	return Math.abs(this.valueOf() - Date.create(date).valueOf()) <= margin;
});

/** @see {@link DateConstructor.is} */
extend(Date, 'is', createStaticDateComparator('is'));

/** @see {@link Date.isPast} */
extend(Date.prototype, 'isPast', function isPast(this: Date): boolean {
	return this.valueOf() < Date.now();
});

/** @see {@link DateConstructor.isPast} */
extend(Date, 'isPast', (date: Date) => date.isPast());

/** @see {@link Date.isFuture} */
extend(Date.prototype, 'isFuture', function isFuture(this: Date): boolean {
	return this.valueOf() > Date.now();
});

/** @see {@link DateConstructor.isFuture} */
extend(Date, 'isFuture', (date: Date) => date.isFuture());

/** @see {@link Date.isAfter} */
extend(Date.prototype, 'isAfter', function isAfter(
	this: Date,
	date: DateCreateValue,
	margin: number = 0
): boolean {
	return this.valueOf() > Date.create(date).valueOf() - margin;
});

/** @see {@link DateConstructor.isAfter} */
extend(Date, 'isAfter', createStaticDateComparator('isAfter'));

/** @see {@link Date.isBefore} */
extend(Date.prototype, 'isBefore', function isBefore(
	this: Date,
	date: DateCreateValue,
	margin: number = 0
): boolean {
	return this.valueOf() < Date.create(date).valueOf() + margin;
});

/** @see {@link DateConstructor.isBefore} */
extend(Date, 'isBefore', createStaticDateComparator('isBefore'));

/** @see {@link Date.isBetween} */
extend(Date.prototype, 'isBetween', function isBetween(
	this: Date,
	left: DateCreateValue,
	right: DateCreateValue,
	margin: number = 0
): boolean {
	const v = this.valueOf();
	return v >= Date.create(left).valueOf() - margin && v <= Date.create(right).valueOf() + margin;
});

/** @see {@link DateConstructor.isBetween} */
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
