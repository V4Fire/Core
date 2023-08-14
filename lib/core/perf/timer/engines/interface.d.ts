/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type engines from '../../../../core/perf/timer/engines/index';
export declare type PerfTimerEngineName = keyof typeof engines;
/**
 * An engine to send time metrics to the target
 */
export interface PerfTimerEngine {
    /**
     * Sends metrics by the specified parameters
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
