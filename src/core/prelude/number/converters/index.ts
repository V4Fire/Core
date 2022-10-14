/* eslint-disable @typescript-eslint/unbound-method */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { createMsFunction, createStaticMsFunction, createStringTypeGetter } from 'core/prelude/number/helpers';

const
	secondInMs = 1e3,
	minuteInMs = 60 * secondInMs,
	hourInMs = 60 * minuteInMs,
	dayInMs = 24 * hourInMs,
	weekInMs = 7 * dayInMs;

/** @see [[Number.second]] */
export const second: PropertyDescriptor = extend(Number.prototype, 'second', createMsFunction(secondInMs));

/** @see [[Number.seconds]] */
export const seconds = extend(Number.prototype, 'seconds', second);

/** @see [[Number.minute]] */
export const minute: PropertyDescriptor = extend(Number.prototype, 'minute', createMsFunction(minuteInMs));

/** @see [[Number.minutes]] */
export const minutes = extend(Number.prototype, 'minutes', minute);

/** @see [[Number.hour]] */
export const hour: PropertyDescriptor = extend(Number.prototype, 'hour', createMsFunction(hourInMs));

/** @see [[Number.hours]] */
export const hours = extend(Number.prototype, 'hours', hour);

/** @see [[Number.day]] */
export const day: PropertyDescriptor = extend(Number.prototype, 'day', createMsFunction(dayInMs));

/** @see [[Number.days]] */
export const days = extend(Number.prototype, 'days', day);

/** @see [[Number.week]] */
export const week: PropertyDescriptor = extend(Number.prototype, 'week', createMsFunction(weekInMs));

/** @see [[Number.weeks]] */
export const weeks = extend(Number.prototype, 'weeks', week);

/** @see [[Number.em]] */
export const em = extend(Number.prototype, 'em', createStringTypeGetter('em'));

/** @see [[Number.rem]] */
export const rem = extend(Number.prototype, 'rem', createStringTypeGetter('rem'));

/** @see [[Number.px]] */
export const px = extend(Number.prototype, 'px', createStringTypeGetter('px'));

/** @see [[Number.per]] */
export const per = extend(Number.prototype, 'per', createStringTypeGetter('per'));

/** @see [[Number.vh]] */
export const vh = extend(Number.prototype, 'vh', createStringTypeGetter('vh'));

/** @see [[Number.vw]] */
export const vw = extend(Number.prototype, 'vw', createStringTypeGetter('vw'));

/** @see [[Number.vmin]] */
export const vmin = extend(Number.prototype, 'vmin', createStringTypeGetter('vmin'));

/** @see [[Number.vmax]] */
export const vmax = extend(Number.prototype, 'vmax', createStringTypeGetter('vmax'));

//#if standalone_prelude
/** @see [[NumberConstructor.weeks]] */
extend(Number, 'weeks', createStaticMsFunction(weekInMs));

/** @see [[NumberConstructor.days]] */
extend(Number, 'days', createStaticMsFunction(dayInMs));

/** @see [[NumberConstructor.hours]] */
extend(Number, 'hours', createStaticMsFunction(hourInMs));

/** @see [[NumberConstructor.second]] */
extend(Number, 'seconds', createStaticMsFunction(secondInMs));

/** @see [[NumberConstructor.minutes]] */
extend(Number, 'minutes', createStaticMsFunction(minuteInMs));
//#endif
