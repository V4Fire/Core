/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { createStaticDateComparator } from 'core/prelude/date/helpers';

/** @see Date.is */
extend(Date.prototype, 'is', function (this: Date, date: DateCreateValue, margin: number = 0): boolean {
	return Math.abs(this.valueOf() - Date.create(date).valueOf()) <= margin;
});

/** @see DateConstructor.is */
extend(Date, 'is', createStaticDateComparator('is'));

/** @see Date.isPast */
extend(Date.prototype, 'isPast', function (this: Date): boolean {
	return this.valueOf() < Date.now();
});

/** @see DateConstructor.isPast */
extend(Date, 'isPast', (date: Date) => date.isPast());

/** @see Date.isFuture */
extend(Date.prototype, 'isFuture', function (this: Date): boolean {
	return this.valueOf() > Date.now();
});

/** @see DateConstructor.isFuture */
extend(Date, 'isFuture', (date: Date) => date.isFuture());

/** @see Date.isAfter */
extend(Date.prototype, 'isAfter', function (
	this: Date,
	date: DateCreateValue,
	margin: number = 0
): boolean {
	return this.valueOf() > Date.create(date).valueOf() - margin;
});

/** @see DateConstructor.isAfter */
extend(Date, 'isAfter', createStaticDateComparator('isAfter'));

/** @see Date.isBefore */
extend(Date.prototype, 'isBefore', function (
	this: Date,
	date: DateCreateValue,
	margin: number = 0
): boolean {
	return this.valueOf() < Date.create(date).valueOf() + margin;
});

/** @see DateConstructor.isBefore */
extend(Date, 'isBefore', createStaticDateComparator('isBefore'));

/** @see Date.isBetween */
extend(Date.prototype, 'isBetween', function (
	this: Date,
	left: DateCreateValue,
	right: DateCreateValue,
	margin: number = 0
): boolean {
	const v = this.valueOf();
	return v >= Date.create(left).valueOf() - margin && v <= Date.create(right).valueOf() + margin;
});

/** @see DateConstructor.isBetween */
// tslint:disable-next-line:only-arrow-functions
extend(Date, 'isBetween', function (
	date: DateCreateValue,
	left: DateCreateValue,
	right: DateCreateValue,
	margin: number = 0
): boolean | AnyFunction {
	if (arguments.length < 3) {
		if (Object.isNumber(date)) {
			margin = date;

		} else {
			right = left;
			left = date;
		}

		return (date, l, r, m) => Date.isBetween(date, left || l, right || r, margin || m);
	}

	return Date.create(date).isBetween(left, right, margin);
});
