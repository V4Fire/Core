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
	second = 1e3,
	minute = 60 * second,
	hour = 60 * minute,
	day = 24 * hour,
	week = 7 * day;

/** @see {@link Number.second} */
extend(Number.prototype, 'second', createMsFunction(second));

/** @see {@link Number.seconds} */
extend(Number.prototype, 'seconds', Number.prototype.second);

/** @see {@link NumberConstructor.second} */
extend(Number, 'seconds', createStaticMsFunction(second));

/** @see {@link Number.minute} */
extend(Number.prototype, 'minute', createMsFunction(minute));

/** @see {@link Number.minutes} */
extend(Number.prototype, 'minutes', Number.prototype.minute);

/** @see {@link NumberConstructor.minutes} */
extend(Number, 'minutes', createStaticMsFunction(minute));

/** @see {@link Number.hour} */
extend(Number.prototype, 'hour', createMsFunction(hour));

/** @see {@link Number.hours} */
extend(Number.prototype, 'hours', Number.prototype.hour);

/** @see {@link NumberConstructor.hours} */
extend(Number, 'hours', createStaticMsFunction(hour));

/** @see {@link Number.day} */
extend(Number.prototype, 'day', createMsFunction(day));

/** @see {@link Number.days} */
extend(Number.prototype, 'days', Number.prototype.day);

/** @see {@link NumberConstructor.days} */
extend(Number, 'days', createStaticMsFunction(day));

/** @see {@link Number.week} */
extend(Number.prototype, 'week', createMsFunction(week));

/** @see {@link Number.weeks} */
extend(Number.prototype, 'weeks', Number.prototype.week);

/** @see {@link NumberConstructor.weeks} */
extend(Number, 'weeks', createStaticMsFunction(week));

/** @see {@link Number.em} */
extend(Number.prototype, 'em', createStringTypeGetter('em'));

/** @see {@link Number.rem} */
extend(Number.prototype, 'rem', createStringTypeGetter('rem'));

/** @see {@link Number.px} */
extend(Number.prototype, 'px', createStringTypeGetter('px'));

/** @see {@link Number.per} */
extend(Number.prototype, 'per', createStringTypeGetter('per'));

/** @see {@link Number.vh} */
extend(Number.prototype, 'vh', createStringTypeGetter('vh'));

/** @see {@link Number.vw} */
extend(Number.prototype, 'vw', createStringTypeGetter('vw'));

/** @see {@link Number.vmin} */
extend(Number.prototype, 'vmin', createStringTypeGetter('vmin'));

/** @see {@link Number.vmax} */
extend(Number.prototype, 'vmax', createStringTypeGetter('vmax'));
