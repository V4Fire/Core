/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

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
	 * Starts measuring for defined metrics name and return timerId of the metrics
	 * @param name - full name of the metrics
	 */
	start(name: string): PerfTimerId;

	/**
	 * Finishes started measurement by its timerId. Works together with {@link start} method
	 *
	 * @param timerId - id of the metrics to stop
	 * @param [additional] - additional params to send along with the metrics
	 */
	finish(timerId: PerfTimerId, additional?: Dictionary): void;

	/**
	 * Measures difference between current moment and the time origin of the corresponding timers runner
	 *
	 * @param name - full name of the metrics
	 * @param [additional] - additional params to send along with the metrics
	 */
	markTimestamp(name: string, additional?: Dictionary): void;

	/**
	 * Returns new instance of the performance timer but with passed suffix
	 *
	 * @example
	 * // `timer` has the namespace 'components'
	 * const timer = getTimer('components');
	 * // `newTimer` has the namespace 'components.button'
	 * const newTimer = timer.namespace('button');
	 *
	 * @param ns - the namespace suffix
	 */
	namespace(ns: string): PerfTimer;
}

export type PerfTimerId = CanUndef<string>;
