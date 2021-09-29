/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type engines from 'core/perf/timer/engines/index';

export type PerfTimerEngineName = keyof typeof engines;

/**
 * Engine that sends time metrics to the target
 */
export interface PerfTimerEngine {
	/**
	 * Sends metrics
	 *
	 * @param name - metrics name
	 * @param duration - difference between two moments of time
	 * @param [additional] - additional data
	 */
	sendDelta(name: string, duration: number, additional?: Dictionary): void;

	/**
	 * Returns a timestamp from the application start
	 */
	getTimestampFromTimeOrigin(): number;
}
