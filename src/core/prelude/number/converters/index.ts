/* eslint-disable @typescript-eslint/unbound-method */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from '~/core/prelude/extend';
import { createMsFunction, createStaticMsFunction, createStringTypeGetter } from '~/core/prelude/number/helpers';

const
	second = 1e3,
	minute = 60 * second,
	hour = 60 * minute,
	day = 24 * hour,
	week = 7 * day;

/** @see [[Number.second]] */
extend(Number.prototype, 'second', createMsFunction(second));

/** @see [[Number.seconds]] */
extend(Number.prototype, 'seconds', Number.prototype.second);

/** @see [[NumberConstructor.second]] */
extend(Number, 'seconds', createStaticMsFunction(second));

/** @see [[Number.minute]] */
extend(Number.prototype, 'minute', createMsFunction(minute));

/** @see [[Number.minutes]] */
extend(Number.prototype, 'minutes', Number.prototype.minute);

/** @see [[NumberConstructor.minutes]] */
extend(Number, 'minutes', createStaticMsFunction(minute));

/** @see [[Number.hour]] */
extend(Number.prototype, 'hour', createMsFunction(hour));

/** @see [[Number.hours]] */
extend(Number.prototype, 'hours', Number.prototype.hour);

/** @see [[NumberConstructor.hours]] */
extend(Number, 'hours', createStaticMsFunction(hour));

/** @see [[Number.day]] */
extend(Number.prototype, 'day', createMsFunction(day));

/** @see [[Number.days]] */
extend(Number.prototype, 'days', Number.prototype.day);

/** @see [[NumberConstructor.days]] */
extend(Number, 'days', createStaticMsFunction(day));

/** @see [[Number.week]] */
extend(Number.prototype, 'week', createMsFunction(week));

/** @see [[Number.weeks]] */
extend(Number.prototype, 'weeks', Number.prototype.week);

/** @see [[NumberConstructor.weeks]] */
extend(Number, 'weeks', createStaticMsFunction(week));

/** @see [[Number.em]] */
extend(Number.prototype, 'em', createStringTypeGetter('em'));

/** @see [[Number.rem]] */
extend(Number.prototype, 'rem', createStringTypeGetter('rem'));

/** @see [[Number.px]] */
extend(Number.prototype, 'px', createStringTypeGetter('px'));

/** @see [[Number.per]] */
extend(Number.prototype, 'per', createStringTypeGetter('per'));

/** @see [[Number.vh]] */
extend(Number.prototype, 'vh', createStringTypeGetter('vh'));

/** @see [[Number.vw]] */
extend(Number.prototype, 'vw', createStringTypeGetter('vw'));

/** @see [[Number.vmin]] */
extend(Number.prototype, 'vmin', createStringTypeGetter('vmin'));

/** @see [[Number.vmax]] */
extend(Number.prototype, 'vmax', createStringTypeGetter('vmax'));
