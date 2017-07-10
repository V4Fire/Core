'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Returns a list of week days
 */
Date.getWeekDays = function (): Array<string> {
	return [t`Mn`, t`Ts`, t`Wd`, t`Th`, t`Fr`, t`St`, t`Sn`];
};
