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

/** {@link Number.second} */
extend(Number.prototype, 'second', createMsFunction(second));

/** {@link Number.seconds} */
extend(Number.prototype, 'seconds', Number.prototype.second);

/** {@link NumberConstructor.second} */
extend(Number, 'seconds', createStaticMsFunction(second));

/** {@link Number.minute} */
extend(Number.prototype, 'minute', createMsFunction(minute));

/** {@link Number.minutes} */
extend(Number.prototype, 'minutes', Number.prototype.minute);

/** {@link NumberConstructor.minutes} */
extend(Number, 'minutes', createStaticMsFunction(minute));

/** {@link Number.hour} */
extend(Number.prototype, 'hour', createMsFunction(hour));

/** {@link Number.hours} */
extend(Number.prototype, 'hours', Number.prototype.hour);

/** {@link NumberConstructor.hours} */
extend(Number, 'hours', createStaticMsFunction(hour));

/** {@link Number.day} */
extend(Number.prototype, 'day', createMsFunction(day));

/** {@link Number.days} */
extend(Number.prototype, 'days', Number.prototype.day);

/** {@link NumberConstructor.days} */
extend(Number, 'days', createStaticMsFunction(day));

/** {@link Number.week} */
extend(Number.prototype, 'week', createMsFunction(week));

/** {@link Number.weeks} */
extend(Number.prototype, 'weeks', Number.prototype.week);

/** {@link NumberConstructor.weeks} */
extend(Number, 'weeks', createStaticMsFunction(week));

/** {@link Number.em} */
extend(Number.prototype, 'em', createStringTypeGetter('em'));

/** {@link Number.rem} */
extend(Number.prototype, 'rem', createStringTypeGetter('rem'));

/** {@link Number.px} */
extend(Number.prototype, 'px', createStringTypeGetter('px'));

/** {@link Number.per} */
extend(Number.prototype, 'per', createStringTypeGetter('per'));

/** {@link Number.vh} */
extend(Number.prototype, 'vh', createStringTypeGetter('vh'));

/** {@link Number.vw} */
extend(Number.prototype, 'vw', createStringTypeGetter('vw'));

/** {@link Number.vmin} */
extend(Number.prototype, 'vmin', createStringTypeGetter('vmin'));

/** {@link Number.vmax} */
extend(Number.prototype, 'vmax', createStringTypeGetter('vmax'));
