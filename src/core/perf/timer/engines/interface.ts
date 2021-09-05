/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type engines from 'core/perf/timer/engines/index';

export type PerfTimerEngineName = keyof typeof engines;

export interface PerfTimerEngine {
	(id: string, ns: string, duration: number, additional?: Dictionary): void;
}
