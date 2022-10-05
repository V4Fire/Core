/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { deprecate } from 'core/functools';

/**
 * @deprecated
 * @see {@link DateConstructor.getWeekDays}
 */
extend(Date, 'getWeekDays', deprecate(function getWeekDays(): string[] {
	return [t`Mn`, t`Ts`, t`Wd`, t`Th`, t`Fr`, t`St`, t`Sn`];
}));
