/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see Date.prototype.clone */
extend(Date.prototype, 'clone', function (this: Date): Date {
	return new Date(this);
});

/** @see DateConstructor.getWeekDays */
extend(Date, 'getWeekDays', () =>
	[t`Mn`, t`Ts`, t`Wd`, t`Th`, t`Fr`, t`St`, t`Sn`]);
