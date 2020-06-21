/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see [[Date.relative]] */
extend(Date.prototype, 'relative', function relative(this: Date): DateRelative {
	return getRelative(this, new Date());
});

/** @see [[DateConstructor.relative]] */
extend(Date, 'relative', (date: DateCreateValue) => Date.create(date).relative());

/** @see [[Date.relativeTo]] */
extend(Date.prototype, 'relativeTo', function relativeTo(this: Date, date: DateCreateValue): DateRelative {
	return getRelative(this, date);
});

/** @see [[DateConstructor.relativeTo]] */
extend(Date, 'relativeTo', function relativeTo(from: DateCreateValue, to: DateCreateValue): DateRelative | AnyFunction {
	if (arguments.length === 1) {
		const d = Date.create(from);
		return (date2) => d.relativeTo(date2);
	}

	return Date.create(from).relativeTo(to);
});

/**
 * Returns a relative value of the date for another date
 *
 * @param from
 * @param to
 */
export function getRelative(from: DateCreateValue, to: DateCreateValue): DateRelative {
	const
		diff = Date.create(to).valueOf() - Date.create(from).valueOf();

	const intervals = [
		{type: 'milliseconds', bound: 1e3},
		{type: 'seconds', bound: 1e3 * 60},
		{type: 'minutes', bound: 1e3 * 60 * 60},
		{type: 'hours', bound: 1e3 * 60 * 60 * 24},
		{type: 'days', bound: 1e3 * 60 * 60 * 24 * 7},
		{type: 'weeks', bound: 1e3 * 60 * 60 * 24 * 30},
		{type: 'months', bound: 1e3 * 60 * 60 * 24 * 365}
	];

	for (let i = 0; i < intervals.length; i++) {
		const
			{type, bound} = intervals[i];

		if (Math.abs(diff) < bound) {
			return {
				type: <DateRelative['type']>type,
				value: Math.floor(diff / (i > 0 ? intervals[i - 1].bound : 1)),
				diff
			};
		}
	}

	return {
		type: 'years',
		value: Math.floor(diff / intervals[intervals.length - 1].bound),
		diff
	};
}
