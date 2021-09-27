/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Perf } from 'core/perf/interface';
import { getTimer, getScopedTimer } from 'core/perf/timer';

export * from 'core/perf/interface';
export * from 'core/perf/timer/impl/interface';

export const perf: Perf = {
	getTimer,
	getScopedTimer
};
