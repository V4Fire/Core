/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { PerfPredicate } from '../../../../core/perf/config';
/**
 * Internal timer measurement
 */
export interface PerfTimerMeasurement {
    /**
     * Timestamp when the measurement was started
     */
    startTimestamp: number;
    /**
     * Full name of the measurement
     */
    name: string;
}
/**
 * Performance timer
 */
export interface PerfTimer {
    /**
     * Starts measuring for the specified name and returns an identifier of the metrics
     * @param name - full name of the metrics
     */
    start(name: string): PerfTimerId;
    /**
     * Finishes started measurement by its identifier.
     * Works together with the `start` method.
     *
     * @param timerId - id of the metrics to stop
     * @param [additional] - additional parameters to send along with the metrics
     */
    finish(timerId: PerfTimerId, additional?: Dictionary): void;
    /**
     * Measures difference between the current moment and the time origin of a corresponding timers runner
     *
     * @param name - full name of the metrics
     * @param [additional] - additional parameters to send along with the metrics
     */
    markTimestamp(name: string, additional?: Dictionary): void;
    /**
     * Returns a new instance of the performance timer but with the passed suffix
     *
     * @param ns - namespace suffix
     *
     * @example
     * ```js
     * // `timer` has a namespace "components"
     * const timer = getTimer('components');
     *
     * // `newTimer` has a namespace "components.button"
     * const newTimer = timer.namespace('button');
     * ```
     */
    namespace(ns: string): PerfTimer;
}
/**
 * Options of a performance timers runner
 */
export interface PerfTimersRunnerOptions {
    /**
     * Predicate to filter metrics
     */
    filter?: PerfPredicate;
    /**
     * If `true`, then a moment of instantiating of the runner is considering as its time origin
     */
    withCurrentTimeOrigin?: boolean;
}
export declare type PerfTimerId = CanUndef<string>;
