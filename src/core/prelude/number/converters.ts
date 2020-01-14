/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

// tslint:disable:binary-expression-operand-order

import extend from 'core/prelude/extend';

const
	second = 1e3,
	minute = 60 * second,
	hour = 60 * minute,
	day = 24 * hour,
	week = 7 * day;

/** @see Number.prototype.second */
extend(Number.prototype, 'second', createMsFunction(second));

/** @see Number.prototype.seconds */
extend(Number.prototype, 'seconds', Number.prototype.second);

/** @see Number.prototype.minute */
extend(Number.prototype, 'minute', createMsFunction(minute));

/** @see Number.prototype.minutes */
extend(Number.prototype, 'minutes', Number.prototype.minute);

/** @see Number.prototype.hour */
extend(Number.prototype, 'hour', createMsFunction(hour));

/** @see Number.prototype.hours */
extend(Number.prototype, 'hours', Number.prototype.hour);

/** @see Number.prototype.day */
extend(Number.prototype, 'day', createMsFunction(day));

/** @see Number.prototype.days */
extend(Number.prototype, 'days', Number.prototype.day);

/** @see Number.prototype.week */
extend(Number.prototype, 'week', createMsFunction(week));

/** @see Number.prototype.weeks */
extend(Number.prototype, 'weeks', Number.prototype.week);

/** @see Number.prototype.em */
extend(Number.prototype, 'em', createPostfixConverter('em'));

/** @see Number.prototype.ex */
extend(Number.prototype, 'ex', createPostfixConverter('ex'));

/** @see Number.prototype.rem */
extend(Number.prototype, 'rem', createPostfixConverter('rem'));

/** @see Number.prototype.px */
extend(Number.prototype, 'px', createPostfixConverter('px'));

/** @see Number.prototype.per */
extend(Number.prototype, 'per', createPostfixConverter('per'));

/** @see Number.prototype.vh */
extend(Number.prototype, 'vh', createPostfixConverter('vh'));

/** @see Number.prototype.vw */
extend(Number.prototype, 'vw', createPostfixConverter('vw'));

/** @see Number.prototype.vmin */
extend(Number.prototype, 'vmin', createPostfixConverter('vmin'));

/** @see Number.prototype.vmax */
extend(Number.prototype, 'vmax', createPostfixConverter('vmax'));

function createPostfixConverter(nm: string): PropertyDescriptor {
	return {
		get(): string {
			return Number(this) + nm;
		}
	};
}

function createMsFunction(offset: number): Function {
	const fn = function (this: number): number {
		return Number(this) * offset;
	};

	fn.valueOf = fn;
	return fn;
}
