/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from '@src/core/prelude/extend';
import { deprecate } from '@src/core/functools';

/**
 * @deprecated
 * @see [[DateConstructor.getWeekDays]]
 */
extend(Date, 'getWeekDays', deprecate(function getWeekDays(): string[] {
	return [t`Mn`, t`Ts`, t`Wd`, t`Th`, t`Fr`, t`St`, t`Sn`];
}));
