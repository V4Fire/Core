/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { createStaticDateComparator } from 'core/prelude/date/helpers';

/** {@link Date.is} */
extend(Date.prototype, 'is', function is(this: Date, date: DateCreateValue, margin: number = 0): boolean {
	return Math.abs(this.valueOf() - Date.create(date).valueOf()) <= margin;
});

/** {@link DateConstructor.is} */
extend(Date, 'is', createStaticDateComparator('is'));

/** {@link Date.isPast} */
extend(Date.prototype, 'isPast', function isPast(this: Date): boolean {
	return this.valueOf() < Date.now();
});

/** {@link DateConstructor.isPast} */
extend(Date, 'isPast', (date: Date) => date.isPast());

/** {@link Date.isFuture} */
extend(Date.prototype, 'isFuture', function isFuture(this: Date): boolean {
	return this.valueOf() > Date.now();
});

/** {@link DateConstructor.isFuture} */
extend(Date, 'isFuture', (date: Date) => date.isFuture());

/** {@link Date.isAfter} */
extend(Date.prototype, 'isAfter', function isAfter(
	this: Date,
	date: DateCreateValue,
	margin: number = 0
): boolean {
	return this.valueOf() > Date.create(date).valueOf() - margin;
});

/** {@link DateConstructor.isAfter} */
extend(Date, 'isAfter', createStaticDateComparator('isAfter'));

/** {@link Date.isBefore} */
extend(Date.prototype, 'isBefore', function isBefore(
	this: Date,
	date: DateCreateValue,
	margin: number = 0
): boolean {
	return this.valueOf() < Date.create(date).valueOf() + margin;
});

/** {@link DateConstructor.isBefore} */
extend(Date, 'isBefore', createStaticDateComparator('isBefore'));

/** {@link Date.isBetween} */
extend(Date.prototype, 'isBetween', function isBetween(
	this: Date,
	left: DateCreateValue,
	right: DateCreateValue,
	margin: number = 0
): boolean {
	const v = this.valueOf();
	return v >= Date.create(left).valueOf() - margin && v <= Date.create(right).valueOf() + margin;
});

/** {@link DateConstructor.isBetween} */
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
